import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureResponderEvent, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText } from "@/components/ui";
import { CommunityVoiceForm } from "@/features/listen/CommunityVoiceForm";
import { audioRepository } from "@/features/listen/listen.data";
import { ListenIcon, ListenIconName } from "@/features/listen/ListenIcon";
import { listenCopy, ListenCopy } from "@/features/listen/listen.copy";
import { listenStorage } from "@/features/listen/listen.storage";
import { AudioItem, AudioProgress, ListenLibraryKey, SavedAudio } from "@/features/listen/listen.types";
import { useAudioPlayer } from "@/features/listen/useAudioPlayer";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

type ViewState = { name: "hub" } | { name: "library"; library: ListenLibraryKey } | { name: "saved" } | { name: "player"; item: AudioItem } | { name: "share" };

const libraries: ListenLibraryKey[] = ["practices", "healing", "science", "nature", "music", "voices"];
const libraryIcons: Record<ListenLibraryKey, ListenIconName> = { practices: "headphones", healing: "heartwave", science: "science", nature: "nature", music: "music", voices: "voices" };
const libraryTints: Record<ListenLibraryKey, string> = { practices: "#F3DED6", healing: "#E7EBDD", science: "#E8E3ED", nature: "#E1EADF", music: "#F2E5D3", voices: "#F1DEDD" };
const filterValues: Record<ListenLibraryKey, string[]> = {
  practices: ["all", "about-life", "about-children", "future-self"], healing: ["all", "calm", "sleep", "release", "focus", "energy"], science: ["all", "grief", "memory", "stress", "sleep", "healing", "relationships"], nature: ["all", "rain", "ocean", "forest", "night"], music: ["all", "instrumental", "piano", "strings", "hopeful"], voices: ["all", "story", "advice", "faith", "hope"],
};

export function ListenScreen() {
  const { user } = useRequireUser();
  const { language } = useApp();
  const copy = listenCopy[language];
  const [view, setView] = useState<ViewState>({ name: "hub" });
  const [saved, setSaved] = useState<SavedAudio[]>([]);
  const [progress, setProgress] = useState<AudioProgress[]>([]);
  const updateProgress = useCallback((next: AudioProgress) => setProgress((current) => [next, ...current.filter((item) => item.audioId !== next.audioId)]), []);
  const player = useAudioPlayer(updateProgress);

  useEffect(() => { Promise.all([listenStorage.getSaved(), listenStorage.getAllAudioProgress()]).then(([savedItems, progressItems]) => { setSaved(savedItems); setProgress(progressItems); }); }, []);

  const toggleSaved = async (id: string) => {
    setSaved(saved.some((item) => item.audioId === id) ? await listenStorage.removeFromSaved(id) : await listenStorage.saveForLater(id));
  };

  const openPlayer = async (item: AudioItem) => {
    await player.open(item, progress.find((entry) => entry.audioId === item.id));
    setView({ name: "player", item });
  };

  const continueItem = useMemo(() => progress
    .filter((item) => item.currentTime > 10 && !item.completed)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((item) => ({ progress: item, audio: audioRepository.getById(item.audioId) }))
    .find((item) => item.audio), [progress]);

  if (!user) return null;

  return <AppScaffold active="library">
    <View style={styles.shell}>
      {view.name === "hub" ? <ListenHub copy={copy} continueItem={continueItem} onContinue={(item: AudioItem) => openPlayer(item)} onLibrary={(library: ListenLibraryKey) => setView({ name: "library", library })} onSaved={() => setView({ name: "saved" })} /> : null}
      {view.name === "library" ? <AudioLibrary copy={copy} library={view.library} progress={progress} saved={saved} onBack={() => setView({ name: "hub" })} onOpen={openPlayer} onSaved={toggleSaved} onShare={() => setView({ name: "share" })} /> : null}
      {view.name === "saved" ? <SavedLibrary copy={copy} saved={saved} progress={progress} onBack={() => setView({ name: "hub" })} onOpen={openPlayer} onSaved={toggleSaved} /> : null}
      {view.name === "player" ? <AudioPlayerPage copy={copy} item={view.item} progress={progress.find((entry) => entry.audioId === view.item.id)} saved={saved.some((entry) => entry.audioId === view.item.id)} player={player} onBack={() => setView({ name: "library", library: libraryForType(view.item) })} onSaved={() => toggleSaved(view.item.id)} /> : null}
      {view.name === "share" ? <CommunityVoiceForm copy={copy} onBack={() => setView({ name: "library", library: "voices" })} /> : null}
      {player.activeItem?.audioUrl && view.name !== "player" ? <MiniPlayer copy={copy} player={player} onOpen={() => setView({ name: "player", item: player.activeItem! })} /> : null}
    </View>
  </AppScaffold>;
}

function ListenHub({ copy, continueItem, onContinue, onLibrary, onSaved }: any) {
  return <View><AppText style={styles.pageTitle}>{copy.title}</AppText><AppText style={styles.pageSubtitle}>{copy.subtitle}</AppText>
    {continueItem ? <View style={styles.continueSection}><AppText style={styles.sectionTitle}>{copy.continue}</AppText><Pressable accessibilityRole="button" style={styles.continueCard} onPress={() => onContinue(continueItem.audio)}><View style={styles.continueArt}><ListenIcon name="headphones" size={32} /></View><View style={styles.flex}><AppText style={styles.cardTitle}>{continueItem.audio.title}</AppText><AppText style={styles.meta}>{formatTime(continueItem.progress.currentTime)} / {formatTime(continueItem.progress.duration || continueItem.audio.duration || 0)}</AppText><ProgressBar value={continueItem.progress.currentTime} max={continueItem.progress.duration || continueItem.audio.duration || 1} /></View><AppText style={styles.resumeText}>{copy.resume}</AppText></Pressable></View> : null}
    <View style={styles.categoryList}>{libraries.map((library) => <Pressable key={library} accessibilityRole="button" accessibilityLabel={`${copy.sections[library].title}. ${copy.sections[library].description}`} style={styles.categoryCard} onPress={() => onLibrary(library)}><View style={[styles.categoryIcon, { backgroundColor: libraryTints[library] }]}><ListenIcon name={libraryIcons[library]} size={31} /></View><View style={styles.flex}><AppText style={styles.cardTitle}>{copy.sections[library].title}</AppText><AppText style={styles.cardDescription}>{copy.sections[library].description}</AppText></View><ListenIcon name="chevron" size={19} color="#AD8D80" /></Pressable>)}</View>
    <Pressable accessibilityRole="button" style={styles.savedLink} onPress={onSaved}><ListenIcon name="bookmark" /><View style={styles.flex}><AppText style={styles.cardTitle}>{copy.savedTitle}</AppText><AppText style={styles.cardDescription}>{copy.savedEmptyText}</AppText></View><ListenIcon name="chevron" size={19} /></Pressable>
  </View>;
}

function AudioLibrary({ copy, library, progress, saved, onBack, onOpen, onSaved, onShare }: { copy: ListenCopy; library: ListenLibraryKey; progress: AudioProgress[]; saved: SavedAudio[]; onBack: () => void; onOpen: (item: AudioItem) => void; onSaved: (id: string) => void; onShare: () => void }) {
  const [filter, setFilter] = useState("all");
  const allItems = audioRepository.getByLibrary(library);
  const items = filter === "all" ? allItems : allItems.filter((item) => item.category === filter);
  return <View><BackButton copy={copy} onPress={onBack} /><AppText style={styles.pageTitle}>{copy.sections[library].title}</AppText><AppText style={styles.pageSubtitle}>{copy.sections[library].description}</AppText>
    <FilterBar labels={copy.filters[library]} values={filterValues[library]} selected={filter} onSelect={setFilter} />
    {library === "voices" ? <Pressable accessibilityRole="button" style={styles.shareCard} onPress={onShare}><View style={styles.shareIcon}><ListenIcon name="mic" size={29} /></View><View style={styles.flex}><AppText style={styles.cardTitle}>{copy.shareVoice}</AppText><AppText style={styles.cardDescription}>{copy.shareVoiceText}</AppText></View><ListenIcon name="chevron" size={19} /></Pressable> : null}
    {items.length ? <View style={styles.audioList}>{items.map((item) => <AudioCard key={item.id} copy={copy} item={item} progress={progress.find((entry: AudioProgress) => entry.audioId === item.id)} saved={saved.some((entry: SavedAudio) => entry.audioId === item.id)} onOpen={() => onOpen(item)} onSaved={() => onSaved(item.id)} />)}</View> : <EmptyLibrary copy={copy} library={library} />}
    {items.length ? <View style={styles.preparingNote}><ListenIcon name="leaf" size={19} /><AppText style={styles.preparingText}>{copy.sections[library].empty}</AppText></View> : null}
  </View>;
}

function AudioCard({ copy, item, progress, saved, onOpen, onSaved }: any) {
  return <Pressable accessibilityRole="button" accessibilityLabel={item.title} style={styles.audioCard} onPress={onOpen}><View style={styles.audioArtwork}><ListenIcon name={iconForType(item.type)} size={29} /><AppText style={styles.previewBadge}>{copy.libraryPreview}</AppText></View><View style={styles.flex}><AppText style={styles.audioTitle}>{item.title}</AppText><AppText style={styles.audioDescription}>{item.description}</AppText>{progress?.currentTime > 10 ? <><AppText style={styles.resumeMeta}>{copy.resumeFrom} {formatTime(progress.currentTime)}</AppText><ProgressBar value={progress.currentTime} max={progress.duration || item.duration || 1} /></> : <AppText style={styles.meta}>{formatDuration(item.duration, copy)}</AppText>}</View><Pressable accessibilityRole="button" accessibilityLabel={saved ? copy.saved : copy.saveLater} hitSlop={10} style={styles.bookmarkButton} onPress={(event) => { event.stopPropagation(); onSaved(); }}><ListenIcon name="bookmark" filled={saved} color={saved ? "#986855" : "#B79D92"} /></Pressable></Pressable>;
}

function SavedLibrary({ copy, saved, progress, onBack, onOpen, onSaved }: any) {
  const [filter, setFilter] = useState("all");
  const typeFilters = ["all", "audio-practice", "sound-healing", "science-insight", "nature-sound", "music", "community-voice"];
  const items = saved.map((entry: SavedAudio) => audioRepository.getById(entry.audioId)).filter(Boolean).filter((item: AudioItem | undefined) => item && (filter === "all" || item.type === filter)) as AudioItem[];
  return <View><BackButton copy={copy} onPress={onBack} /><AppText style={styles.pageTitle}>{copy.savedTitle}</AppText><FilterBar labels={copy.filters.saved} values={typeFilters} selected={filter} onSelect={setFilter} />{items.length ? <View style={styles.audioList}>{items.map((item) => <AudioCard key={item.id} copy={copy} item={item} progress={progress.find((entry: AudioProgress) => entry.audioId === item.id)} saved onOpen={() => onOpen(item)} onSaved={() => onSaved(item.id)} />)}</View> : <View style={styles.savedEmpty}><ListenIcon name="bookmark" size={38} color="#A98374" /><AppText style={styles.emptyTitle}>{copy.savedEmptyTitle}</AppText><AppText style={styles.emptyText}>{copy.savedEmptyText}</AppText></View>}</View>;
}

function AudioPlayerPage({ copy, item, progress, saved, player, onBack, onSaved }: any) {
  const max = player.duration || progress?.duration || item.duration || 1;
  const [trackWidth, setTrackWidth] = useState(0);
  const seekFromEvent = (event: GestureResponderEvent) => {
    if (trackWidth) player.seek((event.nativeEvent.locationX / trackWidth) * max);
  };
  const leavePlayer = () => { player.persist().catch(() => undefined); onBack(); };
  return <View><View style={styles.playerHeader}><BackButton copy={copy} onPress={leavePlayer} /><Pressable accessibilityRole="button" accessibilityLabel={saved ? copy.saved : copy.saveLater} style={styles.playerBookmark} onPress={onSaved}><ListenIcon name="bookmark" filled={saved} /></Pressable></View>
    <View style={styles.playerCard}><View style={styles.playerArtwork}><ListenIcon name={iconForType(item.type)} size={56} color="#77564A" /><AppText style={styles.devLabel}>{copy.devLabel}</AppText></View><AppText style={styles.playerTitle}>{item.title}</AppText><AppText style={styles.playerDescription}>{item.description}</AppText>{item.category ? <View style={styles.categoryPill}><AppText style={styles.categoryPillText}>{item.category.replaceAll("-", " ")}</AppText></View> : null}
      <View style={styles.playerControls}><Pressable accessibilityRole="button" accessibilityLabel="Skip back 15 seconds" style={styles.skipButton} onPress={() => player.seek(player.currentTime - 15)}><ListenIcon name="skipBack" size={30} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel={player.status === "playing" ? copy.pause : copy.resume} disabled={!item.audioUrl} style={[styles.mainPlay, !item.audioUrl && styles.disabled]} onPress={player.status === "playing" ? player.pause : player.play}><ListenIcon name={player.status === "playing" ? "pause" : "play"} size={38} filled /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Skip forward 15 seconds" style={styles.skipButton} onPress={() => player.seek(player.currentTime + 15)}><ListenIcon name="skipForward" size={30} /></Pressable></View>
      <Pressable accessibilityRole="adjustable" accessibilityLabel="Audio progress" accessibilityValue={{ min: 0, max: Math.round(max), now: Math.round(player.currentTime) }} accessibilityActions={[{ name: "increment" }, { name: "decrement" }]} style={styles.playerProgress} onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)} onAccessibilityAction={(event) => player.seek(player.currentTime + (event.nativeEvent.actionName === "increment" ? 15 : -15))} onPress={seekFromEvent}><ProgressBar value={player.currentTime} max={max} /></Pressable><View style={styles.timeRow}><AppText style={styles.meta}>{formatTime(player.currentTime)}</AppText><AppText style={styles.meta}>{formatTime(max)}</AppText></View>
      {!item.audioUrl || player.status === "error" ? <View style={styles.unavailable}><AppText style={styles.unavailableTitle}>{copy.unavailable}</AppText><AppText style={styles.unavailableText}>{copy.unavailableText}</AppText></View> : null}
    </View>
  </View>;
}

function MiniPlayer({ copy, player, onOpen }: any) { return <Pressable accessibilityRole="button" style={styles.miniPlayer} onPress={onOpen}><Pressable accessibilityRole="button" accessibilityLabel={player.status === "playing" ? copy.pause : copy.resume} style={styles.miniControl} onPress={(event) => { event.stopPropagation(); if (player.status === "playing") player.pause(); else player.play(); }}><ListenIcon name={player.status === "playing" ? "pause" : "play"} /></Pressable><View style={styles.flex}><AppText numberOfLines={1} style={styles.miniTitle}>{player.activeItem.title}</AppText><AppText style={styles.meta}>{formatTime(player.currentTime)} / {formatTime(player.duration)}</AppText></View></Pressable>; }

function FilterBar({ labels, values, selected, onSelect }: any) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{values.map((value: string, index: number) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: value === selected }} style={[styles.filterChip, value === selected && styles.filterChipActive]} onPress={() => onSelect(value)}><AppText style={[styles.filterText, value === selected && styles.filterTextActive]}>{labels[index]}</AppText></Pressable>)}</ScrollView>; }
function BackButton({ copy, onPress }: { copy: ListenCopy; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel={copy.back} style={styles.backButton} onPress={onPress}><ListenIcon name="back" /><AppText style={styles.backText}>{copy.back}</AppText></Pressable>; }
function ProgressBar({ value, max }: { value: number; max: number }) { const width = `${Math.min(100, Math.max(0, (value / Math.max(max, 1)) * 100))}%` as `${number}%`; return <View style={styles.progressTrack}><View style={[styles.progressFill, { width }]} /></View>; }
function EmptyLibrary({ copy, library }: { copy: ListenCopy; library: ListenLibraryKey }) { return <View style={styles.emptyCard}><ListenIcon name={libraryIcons[library]} size={39} color="#A27E70" /><AppText style={styles.emptyTitle}>{copy.coming}</AppText><AppText style={styles.emptyText}>{copy.sections[library].empty}</AppText></View>; }
function formatTime(seconds = 0) { return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`; }
function formatDuration(seconds: number | undefined, copy: ListenCopy) { if (!seconds) return copy.coming; return seconds >= 3600 ? `${Math.round(seconds / 60)} ${copy.minutes}` : formatTime(seconds); }
function iconForType(type: AudioItem["type"]): ListenIconName { const icons: Record<AudioItem["type"], ListenIconName> = { "audio-practice": "headphones", "sound-healing": "heartwave", "science-insight": "science", "nature-sound": "nature", music: "music", "community-voice": "voices" }; return icons[type]; }
function libraryForType(item: AudioItem): ListenLibraryKey { return ({ "audio-practice": "practices", "sound-healing": "healing", "science-insight": "science", "nature-sound": "nature", music: "music", "community-voice": "voices" })[item.type] as ListenLibraryKey; }

const styles = StyleSheet.create({
  shell: { width: "100%", maxWidth: 760, alignSelf: "center", paddingBottom: 24 }, flex: { flex: 1 }, pageTitle: { fontFamily: "serif", fontSize: 35, lineHeight: 42, fontWeight: "700", color: "#63473C" }, pageSubtitle: { color: "#977A6E", fontSize: 15, lineHeight: 22, marginTop: 5, marginBottom: 21 }, sectionTitle: { fontFamily: "serif", fontSize: 22, fontWeight: "700", color: "#6B4E42", marginBottom: 10 },
  categoryList: { gap: 10 }, categoryCard: { minHeight: 94, flexDirection: "row", alignItems: "center", gap: 12, padding: 13, borderRadius: 23, backgroundColor: "rgba(255,255,255,.84)", borderWidth: 1, borderColor: "rgba(164,120,101,.14)" }, categoryIcon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center" }, cardTitle: { color: "#66493E", fontSize: 16, fontWeight: "800" }, cardDescription: { color: "#967B70", fontSize: 12, lineHeight: 17, marginTop: 3 },
  savedLink: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 22, padding: 14, marginTop: 14, backgroundColor: "rgba(247,232,222,.78)", borderWidth: 1, borderColor: "rgba(160,116,97,.13)" }, continueSection: { marginBottom: 20 }, continueCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 22, backgroundColor: "#FFFDFC", borderWidth: 1, borderColor: "rgba(155,112,94,.16)" }, continueArt: { width: 58, height: 58, borderRadius: 18, backgroundColor: "#F3DED6", alignItems: "center", justifyContent: "center" }, resumeText: { color: "#996855", fontWeight: "800", fontSize: 12 },
  backButton: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 3, alignSelf: "flex-start" }, backText: { color: "#886A5D", fontSize: 13 }, filterRow: { gap: 7, paddingBottom: 15, paddingRight: 10 }, filterChip: { minHeight: 39, paddingHorizontal: 14, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F5E9E1" }, filterChipActive: { backgroundColor: "#906557" }, filterText: { color: "#8F7368", fontSize: 12, fontWeight: "700" }, filterTextActive: { color: "white" },
  audioList: { gap: 10 }, audioCard: { minHeight: 126, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 22, padding: 12, backgroundColor: "rgba(255,255,255,.82)", borderWidth: 1, borderColor: "rgba(160,116,97,.13)" }, audioArtwork: { width: 82, alignSelf: "stretch", minHeight: 98, borderRadius: 17, backgroundColor: "#F1E2DA", alignItems: "center", justifyContent: "center", padding: 7 }, previewBadge: { color: "#9D796A", fontSize: 8, textAlign: "center", lineHeight: 11, marginTop: 7, textTransform: "uppercase" }, audioTitle: { fontFamily: "serif", color: "#63483D", fontSize: 17, lineHeight: 21, fontWeight: "700" }, audioDescription: { color: "#997F73", fontSize: 11, lineHeight: 16, marginTop: 3 }, meta: { color: "#A18A80", fontSize: 10, marginTop: 6 }, resumeMeta: { color: "#986A58", fontSize: 10, fontWeight: "700", marginTop: 6 }, bookmarkButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  progressTrack: { width: "100%", height: 4, borderRadius: 2, backgroundColor: "#E9DCD5", overflow: "hidden", marginTop: 6 }, progressFill: { height: 4, backgroundColor: "#A87965", borderRadius: 2 }, preparingNote: { flexDirection: "row", gap: 8, borderRadius: 18, padding: 14, backgroundColor: "rgba(235,239,226,.65)", marginTop: 14 }, preparingText: { flex: 1, color: "#798071", fontSize: 12, lineHeight: 18 }, shareCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 22, backgroundColor: "#F7E4DE", padding: 14, marginBottom: 13 }, shareIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.58)" },
  emptyCard: { minHeight: 190, borderRadius: 25, backgroundColor: "rgba(255,255,255,.66)", alignItems: "center", justifyContent: "center", padding: 24, borderWidth: 1, borderColor: "rgba(160,116,97,.11)" }, savedEmpty: { minHeight: 210, borderRadius: 25, backgroundColor: "rgba(255,255,255,.68)", alignItems: "center", justifyContent: "center", padding: 24 }, emptyTitle: { fontFamily: "serif", color: "#6F5144", fontSize: 21, fontWeight: "700", textAlign: "center", marginTop: 10 }, emptyText: { color: "#988075", textAlign: "center", fontSize: 13, lineHeight: 20, marginTop: 5 },
  playerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, playerBookmark: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, playerCard: { borderRadius: 30, backgroundColor: "rgba(255,255,255,.82)", padding: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(160,116,97,.14)" }, playerArtwork: { width: "100%", maxWidth: 390, aspectRatio: 1.55, borderRadius: 25, backgroundColor: "#F1DED5", alignItems: "center", justifyContent: "center" }, devLabel: { color: "#9A7566", fontSize: 10, textTransform: "uppercase", marginTop: 12, textAlign: "center" }, playerTitle: { fontFamily: "serif", fontSize: 29, lineHeight: 35, color: "#60453A", textAlign: "center", marginTop: 20 }, playerDescription: { color: "#967B6F", textAlign: "center", lineHeight: 21, marginTop: 6 }, categoryPill: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, backgroundColor: "#F4E7DF", marginTop: 11 }, categoryPillText: { color: "#936C5C", fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  playerControls: { flexDirection: "row", alignItems: "center", gap: 28, marginVertical: 25 }, skipButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" }, mainPlay: { width: 78, height: 78, borderRadius: 39, alignItems: "center", justifyContent: "center", backgroundColor: "#F1D8CE", borderWidth: 1, borderColor: "#D8AC99" }, disabled: { opacity: .48 }, playerProgress: { width: "100%", minHeight: 44, justifyContent: "center" }, timeRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: -7 }, unavailable: { width: "100%", borderRadius: 18, backgroundColor: "#F7EDE7", padding: 14, marginTop: 14 }, unavailableTitle: { color: "#79574A", fontWeight: "800", textAlign: "center" }, unavailableText: { color: "#9B8175", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 4 },
  miniPlayer: { position: "absolute", left: 0, right: 0, bottom: 4, minHeight: 66, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 20, padding: 10, backgroundColor: "#FFF9F4", borderWidth: 1, borderColor: "rgba(146,103,85,.2)", shadowColor: "#705246", shadowOpacity: .13, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }, miniControl: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F1D9CF", alignItems: "center", justifyContent: "center" }, miniTitle: { color: "#674A3E", fontWeight: "700", fontSize: 13 },
});
