import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppText, SoftButton } from "@/components/ui";
import { ListenIcon } from "@/features/listen/ListenIcon";
import { ListenCopy } from "@/features/listen/listen.copy";
import { listenStorage, saveCommunityDraftAudio } from "@/features/listen/listen.storage";
import { CommunityVoiceCategory, CommunityVoiceDraft } from "@/features/listen/listen.types";
import { useVoiceRecorder } from "@/features/voiceJournal/useVoiceRecorder";

const categories: CommunityVoiceCategory[] = ["story", "advice", "faith", "hope"];
const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;

export function CommunityVoiceForm({ copy, onBack }: { copy: ListenCopy; onBack: () => void }) {
  const recorder = useVoiceRecorder();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CommunityVoiceCategory>("story");
  const [draftId] = useState(() => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [uploaded, setUploaded] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const [drafts, setDrafts] = useState<CommunityVoiceDraft[]>([]);
  const [feedback, setFeedback] = useState("");
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { listenStorage.getDrafts().then(setDrafts); }, []);
  useEffect(() => () => {
    audioRef.current?.pause();
    if (uploaded) URL.revokeObjectURL(uploaded.url);
  }, [uploaded]);

  const audio = recorder.preview
    ? { blob: recorder.preview.blob, url: recorder.preview.url, duration: recorder.preview.duration }
    : uploaded;

  const pickAudio = () => {
    if (Platform.OS !== "web") {
      setFeedback(copy.unavailableText);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      if (uploaded) URL.revokeObjectURL(uploaded.url);
      recorder.discard();
      const url = URL.createObjectURL(file);
      const probe = new Audio(url);
      probe.onloadedmetadata = () => setUploaded({ blob: file, url, duration: Number.isFinite(probe.duration) ? probe.duration : 0 });
      probe.onerror = () => setFeedback(copy.unavailable);
    };
    input.click();
  };

  const togglePreview = async () => {
    if (!audio || typeof Audio === "undefined") return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audio.url);
      audioRef.current.onended = () => setPreviewPlaying(false);
    }
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setPreviewPlaying(true);
    } else {
      audioRef.current.pause();
      setPreviewPlaying(false);
    }
  };

  const clearAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPreviewPlaying(false);
    recorder.discard();
    if (uploaded) URL.revokeObjectURL(uploaded.url);
    setUploaded(null);
  };

  const saveDraft = async () => {
    const now = new Date().toISOString();
    const existing = drafts.find((item) => item.id === draftId);
    if (audio && Platform.OS === "web") await saveCommunityDraftAudio(draftId, audio.blob);
    const draft: CommunityVoiceDraft = {
      id: draftId,
      title: title.trim(),
      description: description.trim(),
      category,
      localAudioId: audio ? draftId : undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    setDrafts(await listenStorage.saveDraft(draft));
    setFeedback(copy.draftSaved);
  };

  const recordingActive = recorder.state === "recording" || recorder.state === "paused";

  return <View>
    <Pressable accessibilityRole="button" accessibilityLabel={copy.back} style={styles.back} onPress={onBack}><ListenIcon name="back" /><AppText style={styles.backText}>{copy.back}</AppText></Pressable>
    <AppText style={styles.title}>{copy.shareVoice}</AppText>
    <AppText style={styles.subtitle}>{copy.shareVoiceText}</AppText>
    <View style={styles.formCard}>
      <AppText style={styles.label}>{copy.titleField}</AppText>
      <TextInput accessibilityLabel={copy.titleField} value={title} onChangeText={setTitle} placeholder={copy.titlePlaceholder} placeholderTextColor="#B49D92" style={styles.input} />
      <AppText style={styles.label}>{copy.aboutField}</AppText>
      <TextInput accessibilityLabel={copy.aboutField} value={description} onChangeText={setDescription} placeholder={copy.aboutPlaceholder} placeholderTextColor="#B49D92" multiline textAlignVertical="top" style={[styles.input, styles.textarea]} />
      <AppText style={styles.label}>{copy.categoryField}</AppText>
      <View style={styles.chips}>{categories.map((value, index) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: category === value }} style={[styles.chip, category === value && styles.chipActive]} onPress={() => setCategory(value)}><AppText style={[styles.chipText, category === value && styles.chipTextActive]}>{copy.communityCategories[index]}</AppText></Pressable>)}</View>
      <AppText style={styles.label}>{copy.recordingField}</AppText>
      <View style={styles.recorderCard}>
        <View style={[styles.micCircle, recordingActive && styles.micCircleActive]}><ListenIcon name="mic" size={34} /></View>
        <AppText style={styles.timer}>{formatTime(recorder.elapsed || audio?.duration || 0)}</AppText>
        {recordingActive ? <View style={styles.recordActions}>
          <Pressable accessibilityRole="button" style={styles.control} onPress={recorder.state === "paused" ? recorder.resume : recorder.pause}><ListenIcon name={recorder.state === "paused" ? "play" : "pause"} /><AppText style={styles.controlText}>{recorder.state === "paused" ? copy.resumeRecording : copy.pause}</AppText></Pressable>
          <Pressable accessibilityRole="button" style={styles.control} onPress={recorder.stop}><ListenIcon name="stop" /><AppText style={styles.controlText}>{copy.stop}</AppText></Pressable>
        </View> : audio ? <>
          <Pressable accessibilityRole="button" accessibilityLabel={copy.preview} style={styles.previewButton} onPress={togglePreview}><ListenIcon name={previewPlaying ? "pause" : "play"} /><AppText style={styles.controlText}>{copy.preview}</AppText></Pressable>
          <View style={styles.recordActions}><Pressable accessibilityRole="button" style={styles.control} onPress={() => { clearAudio(); recorder.start(); }}><AppText style={styles.controlText}>{copy.recordAgain}</AppText></Pressable><Pressable accessibilityRole="button" style={styles.control} onPress={clearAudio}><AppText style={styles.destructive}>{copy.deleteRecording}</AppText></Pressable></View>
        </> : <View style={styles.recordActions}><Pressable accessibilityRole="button" style={styles.control} onPress={recorder.start}><ListenIcon name="mic" /><AppText style={styles.controlText}>{copy.record}</AppText></Pressable><Pressable accessibilityRole="button" style={styles.control} onPress={pickAudio}><AppText style={styles.controlText}>{copy.uploadAudio}</AppText></Pressable></View>}
        {recorder.problem ? <AppText style={styles.feedback}>{copy.unavailableText}</AppText> : null}
      </View>
      <SoftButton title={copy.saveDraft} onPress={saveDraft} disabled={!title.trim() && !description.trim() && !audio} />
      <View style={styles.secondary}><SoftButton title={copy.submitReview} variant="secondary" onPress={() => setFeedback(copy.reviewUnavailable)} /></View>
      {feedback ? <AppText accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</AppText> : null}
    </View>
    <AppText style={styles.draftsTitle}>{copy.drafts}</AppText>
    {drafts.length ? <View style={styles.drafts}>{drafts.map((draft) => <View key={draft.id} style={styles.draftCard}><AppText style={styles.draftTitle}>{draft.title || copy.shareVoice}</AppText><AppText numberOfLines={2} style={styles.draftText}>{draft.description || copy.draftSaved}</AppText></View>)}</View> : <View style={styles.empty}><AppText style={styles.emptyText}>{copy.noDrafts}</AppText></View>}
  </View>;
}

const styles = StyleSheet.create({
  back: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 3, alignSelf: "flex-start" }, backText: { color: "#886A5D", fontSize: 13 }, title: { fontFamily: "serif", fontSize: 34, lineHeight: 41, fontWeight: "700", color: "#65483D", marginTop: 7 }, subtitle: { color: "#967A6E", lineHeight: 22, marginTop: 5, marginBottom: 18 },
  formCard: { padding: 18, borderRadius: 27, backgroundColor: "rgba(255,255,255,.8)", borderWidth: 1, borderColor: "rgba(166,121,102,.15)" }, label: { color: "#725448", fontWeight: "700", fontSize: 13, marginBottom: 7, marginTop: 10 }, input: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: "rgba(155,113,95,.2)", backgroundColor: "rgba(255,250,246,.86)", paddingHorizontal: 14, color: "#644A3F", fontSize: 14 }, textarea: { minHeight: 112, paddingTop: 14 }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 7 }, chip: { minHeight: 40, borderRadius: 20, paddingHorizontal: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F5E9E1" }, chipActive: { backgroundColor: "#936858" }, chipText: { color: "#907468", fontSize: 12, fontWeight: "700" }, chipTextActive: { color: "white" },
  recorderCard: { borderRadius: 22, backgroundColor: "#FFF7F1", alignItems: "center", padding: 17, marginBottom: 15 }, micCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#F6DDD5", alignItems: "center", justifyContent: "center" }, micCircleActive: { borderWidth: 2, borderColor: "#D6A08C" }, timer: { fontFamily: "serif", fontSize: 27, color: "#6F5145", marginVertical: 9 }, recordActions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }, control: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 13, borderRadius: 15, backgroundColor: "rgba(245,231,222,.85)" }, controlText: { color: "#785A4E", fontWeight: "700", fontSize: 12 }, previewButton: { minHeight: 46, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 18, borderRadius: 18, backgroundColor: "#F2DDD3", marginBottom: 9 }, destructive: { color: "#A06E60", fontWeight: "700", fontSize: 12 }, secondary: { marginTop: 9 }, feedback: { textAlign: "center", color: "#986B5B", fontSize: 12, lineHeight: 18, marginTop: 10 },
  draftsTitle: { fontFamily: "serif", fontSize: 23, color: "#674A3E", marginTop: 22, marginBottom: 10 }, drafts: { gap: 8 }, draftCard: { borderRadius: 18, backgroundColor: "rgba(255,255,255,.72)", padding: 14, borderWidth: 1, borderColor: "rgba(160,116,97,.12)" }, draftTitle: { color: "#6C4F43", fontWeight: "700" }, draftText: { color: "#9A8074", fontSize: 12, lineHeight: 18, marginTop: 3 }, empty: { padding: 18, borderRadius: 18, backgroundColor: "rgba(247,235,227,.66)" }, emptyText: { color: "#987E73", textAlign: "center", fontSize: 13 },
});
