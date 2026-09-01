import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";
import { SoftWaveform } from "@/features/voiceJournal/SoftWaveform";
import { useVoiceRecorder } from "@/features/voiceJournal/useVoiceRecorder";
import { useLocalAudioPlayer } from "@/features/voiceJournal/useLocalAudioPlayer";
import { VoiceJournalIcon } from "@/features/voiceJournal/VoiceJournalIcon";
import {
  deleteVoiceRecording,
  getVoiceRecordingAudio,
  listVoiceRecordings,
  saveVoiceRecording,
  VoiceRecording,
} from "@/features/voiceJournal/voiceJournalStorage";

type Confirmation =
  | { type: "delete-preview" }
  | { type: "delete-saved"; recording: VoiceRecording }
  | { type: "replace" }
  | null;

const localeByLanguage = {
  en: "en-US",
  uk: "uk-UA",
  ru: "ru-RU",
} as const;

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function ProgressLine({ progress }: { progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }]} />
    </View>
  );
}

export function VoiceJournalScreen() {
  const router = useRouter();
  const { user } = useRequireUser();
  const { copy, language } = useApp();
  const recorder = useVoiceRecorder();
  const playback = useLocalAudioPlayer();
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const savedAudioUrlRef = useRef<string | null>(null);

  const locale = localeByLanguage[language];
  const titleFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        month: "short",
      }),
    [locale],
  );

  const loadRecordings = useCallback(async () => {
    try {
      setRecordings(await listVoiceRecordings());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecordings().catch(() => setIsLoading(false));
  }, [loadRecordings]);

  useEffect(
    () => () => {
      if (savedAudioUrlRef.current) URL.revokeObjectURL(savedAudioUrlRef.current);
    },
    [],
  );

  if (!user) return null;

  const togglePreview = async () => {
    if (!recorder.preview) return;
    await playback.toggle("preview", recorder.preview.url);
  };

  const toggleSavedRecording = async (recording: VoiceRecording) => {
    const key = `saved:${recording.id}`;
    if (playback.activeKey === key) {
      const currentSource = savedAudioUrlRef.current || recording.uri;
      if (currentSource) await playback.toggle(key, currentSource);
      return;
    }

    if (savedAudioUrlRef.current && Platform.OS === "web") {
      URL.revokeObjectURL(savedAudioUrlRef.current);
      savedAudioUrlRef.current = null;
    }
    const storedAudio = await getVoiceRecordingAudio(recording);
    if (!storedAudio) return;
    const source = typeof storedAudio === "string"
      ? storedAudio
      : URL.createObjectURL(storedAudio);
    if (typeof storedAudio !== "string") savedAudioUrlRef.current = source;
    await playback.toggle(key, source);
  };

  const savePreview = async () => {
    if (!recorder.preview) return;
    setIsSaving(true);
    setSuccess(false);
    const createdAt = new Date().toISOString();
    const recording: VoiceRecording = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt,
      duration: recorder.preview.duration,
      mimeType: recorder.preview.mimeType,
      title: `${copy.voiceJournal.reflection} · ${titleFormatter.format(new Date(createdAt))}`,
    };

    try {
      const audio = recorder.preview.blob ?? recorder.preview.uri;
      const persisted = await saveVoiceRecording(recording, audio);
      await playback.stop();
      await recorder.discard();
      setRecordings((current) => [persisted, ...current]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2400);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmAction = async () => {
    const action = confirmation;
    setConfirmation(null);
    if (!action) return;

    if (action.type === "delete-saved") {
      if (playback.activeKey === `saved:${action.recording.id}`) await playback.stop();
      await deleteVoiceRecording(action.recording.id);
      setRecordings((current) => current.filter((item) => item.id !== action.recording.id));
      setMenuId(null);
      return;
    }

    await playback.stop();
    await recorder.discard();
    if (action.type === "replace") await recorder.start();
  };

  const isRecording = recorder.state === "recording";
  const isPaused = recorder.state === "paused";
  const isPreview = recorder.state === "preview" && recorder.preview;

  return (
    <AppScaffold active="journal">
      <View style={styles.contentWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.common.back}
          hitSlop={10}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <VoiceJournalIcon name="back" size={26} />
        </Pressable>

        <View style={styles.heading}>
          <AppText style={styles.title}>{copy.voiceJournal.title}</AppText>
          <AppText style={styles.subtitle}>{copy.voiceJournal.subtitle}</AppText>
        </View>

        <View style={styles.recorderCard}>
          {!recorder.isSupported ? (
            <View style={styles.fallbackBlock}>
              <View style={styles.micCircleSmall}>
                <VoiceJournalIcon name="mic" size={38} />
              </View>
              <AppText style={styles.fallbackTitle}>{copy.voiceJournal.unsupportedTitle}</AppText>
              <AppText style={styles.fallbackText}>{copy.voiceJournal.unsupportedText}</AppText>
            </View>
          ) : recorder.problem ? (
            <View style={styles.fallbackBlock}>
              <View style={styles.micCircleSmall}>
                <VoiceJournalIcon name="mic" size={38} />
              </View>
              <AppText style={styles.fallbackTitle}>
                {recorder.problem === "permission"
                  ? copy.voiceJournal.permissionTitle
                  : copy.voiceJournal.recordingErrorTitle}
              </AppText>
              <AppText style={styles.fallbackText}>
                {recorder.problem === "permission"
                  ? copy.voiceJournal.permissionText
                  : copy.voiceJournal.recordingErrorText}
              </AppText>
              <SoftButton title={copy.voiceJournal.tryAgain} onPress={recorder.start} />
            </View>
          ) : recorder.state === "idle" ? (
            <View style={styles.idleBlock}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={copy.voiceJournal.startLabel}
                style={styles.micButton}
                onPress={recorder.start}
              >
                <VoiceJournalIcon name="mic" size={54} />
              </Pressable>
              <AppText style={styles.tapText}>{copy.voiceJournal.tapToRecord}</AppText>
              <AppText style={styles.privatePrompt}>{copy.voiceJournal.privatePrompt}</AppText>
            </View>
          ) : isPreview ? (
            <View style={styles.previewBlock}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={playback.activeKey === "preview" && playback.isPlaying ? copy.voiceJournal.pausePreview : copy.voiceJournal.playPreview}
                style={styles.previewPlayButton}
                onPress={togglePreview}
              >
                <VoiceJournalIcon name={playback.activeKey === "preview" && playback.isPlaying ? "pause" : "play"} size={30} />
              </Pressable>
              <AppText style={styles.timer}>
                {formatDuration(recorder.preview?.duration ?? 0)}
              </AppText>
              <ProgressLine
                progress={playback.activeKey === "preview" ? playback.currentTime / Math.max(playback.duration || recorder.preview?.duration || 0, 1) : 0}
              />
              <AppText style={styles.previewLabel}>{copy.voiceJournal.previewReady}</AppText>
            </View>
          ) : (
            <View style={styles.activeBlock}>
              <View style={[styles.micButton, styles.micButtonActive]}>
                <VoiceJournalIcon name="mic" size={50} />
              </View>
              <AppText accessibilityLiveRegion="polite" style={styles.timer}>
                {formatDuration(recorder.elapsed)}
              </AppText>
              <SoftWaveform active={isRecording} />
              <View style={styles.recordingActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isPaused ? copy.voiceJournal.resume : copy.voiceJournal.pause}
                  style={styles.recordingAction}
                  onPress={isPaused ? recorder.resume : recorder.pause}
                >
                  <VoiceJournalIcon name={isPaused ? "play" : "pause"} size={20} />
                  <AppText style={styles.recordingActionText}>
                    {isPaused ? copy.voiceJournal.resume : copy.voiceJournal.pause}
                  </AppText>
                </Pressable>
                <View style={styles.actionDivider} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={copy.voiceJournal.stop}
                  style={styles.recordingAction}
                  onPress={recorder.stop}
                >
                  <VoiceJournalIcon name="stop" size={20} />
                  <AppText style={styles.recordingActionText}>{copy.voiceJournal.stop}</AppText>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {isPreview ? (
          <View style={styles.previewActions}>
            <SoftButton
              isLoading={isSaving}
              title={copy.voiceJournal.save}
              leftIcon={<VoiceJournalIcon name="save" size={22} color="#FFFFFF" />}
              onPress={savePreview}
              style={styles.saveButton}
            />
            <Pressable
              accessibilityRole="button"
              style={styles.secondaryAction}
              onPress={() => setConfirmation({ type: "replace" })}
            >
              <VoiceJournalIcon name="rotate" size={22} />
              <AppText style={styles.secondaryActionText}>{copy.voiceJournal.recordAgain}</AppText>
              <AppText style={styles.secondaryChevron}>›</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.secondaryAction}
              onPress={() => setConfirmation({ type: "delete-preview" })}
            >
              <VoiceJournalIcon name="trash" size={22} color="#A36F62" />
              <AppText style={styles.deleteActionText}>{copy.voiceJournal.delete}</AppText>
              <AppText style={styles.secondaryChevron}>›</AppText>
            </Pressable>
          </View>
        ) : null}

        {success ? (
          <AppText accessibilityLiveRegion="polite" style={styles.successText}>
            ✓ {copy.voiceJournal.saved}
          </AppText>
        ) : null}

        <View style={styles.recentSection}>
          <View style={styles.recentHeadingRow}>
            <AppText style={styles.recentTitle}>{copy.voiceJournal.recent}</AppText>
            <View style={styles.recentLine} />
          </View>

          {!isLoading && recordings.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <VoiceJournalIcon name="mic" size={28} color="#9B786A" />
              </View>
              <AppText style={styles.emptyTitle}>{copy.voiceJournal.emptyTitle}</AppText>
              <AppText style={styles.emptyText}>{copy.voiceJournal.emptyText}</AppText>
            </View>
          ) : (
            <View style={styles.recordingList}>
              {recordings.map((recording) => {
                const isPlaying = playback.activeKey === `saved:${recording.id}` && playback.isPlaying;
                const progress = playback.activeKey === `saved:${recording.id}`
                  ? playback.currentTime / Math.max(playback.duration || recording.duration, 1)
                  : 0;
                return (
                  <View key={recording.id} style={styles.recordingRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={isPlaying ? copy.voiceJournal.pauseRecording : copy.voiceJournal.playRecording}
                      style={styles.rowPlayButton}
                      onPress={() => toggleSavedRecording(recording)}
                    >
                      <VoiceJournalIcon name={isPlaying ? "pause" : "play"} size={22} />
                    </Pressable>
                    <View style={styles.recordingInfo}>
                      <AppText numberOfLines={2} style={styles.recordingTitle}>
                        {recording.title}
                      </AppText>
                      <View style={styles.rowProgressWrap}>
                        <ProgressLine progress={progress} />
                      </View>
                    </View>
                    <AppText style={styles.rowDuration}>
                      {formatDuration(recording.duration)}
                    </AppText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={copy.voiceJournal.recordingMenu}
                      hitSlop={8}
                      style={styles.moreButton}
                      onPress={() => setMenuId((current) => (current === recording.id ? null : recording.id))}
                    >
                      <VoiceJournalIcon name="more" size={20} color="#A58679" />
                    </Pressable>
                    {menuId === recording.id ? (
                      <View style={styles.rowMenu}>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => setConfirmation({ type: "delete-saved", recording })}
                        >
                          <AppText style={styles.rowMenuDelete}>{copy.voiceJournal.deleteRecording}</AppText>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.privacyCard}>
          <VoiceJournalIcon name="lock" size={20} color="#87675A" />
          <AppText style={styles.privacyText}>{copy.voiceJournal.privacy}</AppText>
        </View>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={confirmation !== null}
        onRequestClose={() => setConfirmation(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <AppText style={styles.confirmationTitle}>
              {confirmation?.type === "replace"
                ? copy.voiceJournal.replaceTitle
                : copy.voiceJournal.deleteTitle}
            </AppText>
            <AppText style={styles.confirmationText}>
              {confirmation?.type === "replace"
                ? copy.voiceJournal.replaceText
                : confirmation?.type === "delete-saved"
                  ? copy.voiceJournal.deleteSavedText
                  : copy.voiceJournal.deletePreviewText}
            </AppText>
            <View style={styles.confirmationActions}>
              <SoftButton
                title={confirmation?.type === "replace" ? copy.voiceJournal.keepRecording : copy.common.cancel}
                variant="secondary"
                onPress={() => setConfirmation(null)}
              />
              <SoftButton
                title={confirmation?.type === "replace" ? copy.voiceJournal.recordAgain : copy.voiceJournal.delete}
                onPress={confirmAction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  contentWrap: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  heading: {
    alignItems: "center",
    marginTop: 2,
    marginBottom: 18,
  },
  title: {
    fontFamily: "serif",
    fontSize: 38,
    lineHeight: 46,
    color: "#65493E",
  },
  subtitle: {
    marginTop: 5,
    maxWidth: 390,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#98776A",
  },
  recorderCard: {
    minHeight: 320,
    padding: 24,
    borderRadius: 31,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(188,143,126,0.18)",
    shadowColor: "#8C6B5E",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  idleBlock: {
    alignItems: "center",
  },
  micButton: {
    width: 126,
    height: 126,
    borderRadius: 63,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8DCD5",
    borderWidth: 2,
    borderColor: "#FFF6F1",
    shadowColor: "#DCA28F",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
  },
  micButtonActive: {
    backgroundColor: "#F5CDC5",
    borderColor: "#FFF9F5",
    shadowOpacity: 0.32,
  },
  micCircleSmall: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8E1DA",
  },
  tapText: {
    marginTop: 18,
    fontFamily: "serif",
    fontSize: 24,
    color: "#6D5045",
  },
  privatePrompt: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: "#A18478",
  },
  fallbackBlock: {
    alignItems: "center",
    gap: 12,
  },
  fallbackTitle: {
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 23,
    color: "#705247",
  },
  fallbackText: {
    maxWidth: 390,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#9A7C70",
  },
  activeBlock: {
    alignItems: "center",
  },
  timer: {
    marginTop: 14,
    fontFamily: "serif",
    fontSize: 32,
    color: "#674A3F",
  },
  recordingActions: {
    width: "100%",
    marginTop: 13,
    paddingTop: 16,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EEDDD6",
  },
  recordingAction: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  recordingActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6D5045",
  },
  actionDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#EEDDD6",
  },
  previewBlock: {
    alignItems: "center",
  },
  previewPlayButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6D7CF",
  },
  previewLabel: {
    marginTop: 14,
    fontSize: 13,
    color: "#95786D",
  },
  progressTrack: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "#F0DED8",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#D59683",
  },
  previewActions: {
    marginTop: 16,
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#B98574",
  },
  secondaryAction: {
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.84)",
    borderWidth: 1,
    borderColor: "rgba(184,139,122,0.16)",
  },
  secondaryActionText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#6D5045",
  },
  deleteActionText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#A36F62",
  },
  secondaryChevron: {
    fontSize: 28,
    color: "#B69689",
  },
  successText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#718472",
  },
  recentSection: {
    marginTop: 26,
  },
  recentHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  recentTitle: {
    fontFamily: "serif",
    fontSize: 24,
    color: "#65493E",
  },
  recentLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4C7BB",
  },
  emptyCard: {
    marginTop: 14,
    padding: 22,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4E4DD",
  },
  emptyTitle: {
    marginTop: 11,
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 19,
    color: "#705247",
  },
  emptyText: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#9A8176",
  },
  recordingList: {
    marginTop: 14,
    gap: 10,
  },
  recordingRow: {
    minHeight: 92,
    padding: 13,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.84)",
    borderWidth: 1,
    borderColor: "rgba(184,139,122,0.15)",
  },
  rowPlayButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7DDD5",
  },
  recordingInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  recordingTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    color: "#694D42",
  },
  rowProgressWrap: {
    marginTop: 8,
  },
  rowDuration: {
    fontSize: 12,
    color: "#876B60",
  },
  moreButton: {
    width: 36,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  rowMenu: {
    position: "absolute",
    right: 12,
    bottom: -38,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#E8D6CE",
    shadowColor: "#6C4F43",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  rowMenuDelete: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A36F62",
  },
  privacyCard: {
    marginTop: 24,
    padding: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "rgba(246,236,228,0.78)",
  },
  privacyText: {
    flexShrink: 1,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#876F64",
  },
  modalOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(58,42,35,0.28)",
  },
  confirmationCard: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
    borderRadius: 28,
    backgroundColor: "#FFF9F2",
  },
  confirmationTitle: {
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 24,
    color: "#684C41",
  },
  confirmationText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#94786C",
  },
  confirmationActions: {
    marginTop: 20,
    gap: 10,
  },
});
