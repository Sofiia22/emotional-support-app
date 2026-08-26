import { useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { WriteIcon } from "@/features/writeJournal/WriteIcon";
import { writeJournalCopy } from "@/features/writeJournal/writeJournalCopy";
import {
  categoryGlyph,
  categoryOrder,
  categoryTint,
  getScienceArticles,
  ScienceArticle,
  ScienceCategory,
} from "@/features/writeJournal/writeJournalContent";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import {
  JournalCategory,
  JournalEntry,
  useApp,
} from "@/shared/state/AppProvider";

type JournalView = "home" | "setup" | "editor" | "saved" | "library" | "detail";
type ConfirmState = "leave" | "delete" | null;

const journalFilters: (JournalCategory | "all")[] = [
  "all",
  "free-thoughts",
  "future-self",
  "past-self",
  "heavenly-conversation",
  "letter-to-god",
];
const scienceFilters: (ScienceCategory | "all")[] = ["all", "grief", "sleep", "memory", "stress", "healing", "relationships"];

export function WriteJournalScreen() {
  const { user } = useRequireUser();
  const {
    language,
    journalEntries,
    addStructuredJournalEntry,
    updateStructuredJournalEntry,
    deleteJournalEntry,
  } = useApp();
  const copy = writeJournalCopy[language];
  const articles = useMemo(() => getScienceArticles(language), [language]);
  const [tab, setTab] = useState<"journal" | "science">("journal");
  const [journalView, setJournalView] = useState<JournalView>("home");
  const [category, setCategory] = useState<JournalCategory>("free-thoughts");
  const [recipient, setRecipient] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [journalFilter, setJournalFilter] = useState<JournalCategory | "all">("all");
  const [scienceFilter, setScienceFilter] = useState<ScienceCategory | "all">("all");
  const [article, setArticle] = useState<ScienceArticle | null>(null);
  const [validation, setValidation] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const entries = useMemo(
    () => [...journalEntries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [journalEntries],
  );
  const selectedEntry = entries.find((item) => item.id === selectedEntryId) ?? null;
  const filteredEntries = entries.filter((item) =>
    journalFilter === "all" ? true : (item.category ?? "free-thoughts") === journalFilter,
  );
  const dirty = content.trim().length > 0 && content !== initialContent;

  const resetDraft = () => {
    setRecipient("");
    setSelectedPrompt("");
    setContent("");
    setInitialContent("");
    setEditingId(null);
    setValidation("");
  };

  const leaveEditor = () => {
    resetDraft();
    setJournalView("home");
  };

  const requestEditorBack = () => {
    if (dirty) setConfirm("leave");
    else leaveEditor();
  };

  useEffect(() => {
    if (journalView !== "editor" || !dirty) return;
    const nativeSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setConfirm("leave");
      return true;
    });
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (Platform.OS === "web") window.addEventListener("beforeunload", beforeUnload);
    return () => {
      nativeSubscription.remove();
      if (Platform.OS === "web") window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [dirty, journalView]);

  if (!user) return null;

  const openCategory = (nextCategory: JournalCategory) => {
    resetDraft();
    setCategory(nextCategory);
    setJournalView(nextCategory === "heavenly-conversation" ? "setup" : "editor");
  };

  const openEntry = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
    setJournalView("detail");
  };

  const editEntry = (entry: JournalEntry) => {
    const nextCategory = entry.category ?? "free-thoughts";
    setCategory(nextCategory);
    setRecipient(entry.recipientName ?? "");
    setSelectedPrompt(entry.prompt ?? "");
    setContent(entry.text);
    setInitialContent(entry.text);
    setEditingId(entry.id);
    setValidation("");
    setJournalView("editor");
  };

  const saveEntry = () => {
    if (!content.trim()) {
      setValidation(copy.blank);
      return;
    }
    if (editingId) {
      updateStructuredJournalEntry(editingId, {
        text: content,
        category,
        recipientName: recipient,
        prompt: selectedPrompt,
      });
      setSelectedEntryId(editingId);
    } else {
      setSelectedEntryId(addStructuredJournalEntry({
        text: content,
        category,
        recipientName: recipient,
        prompt: selectedPrompt,
      }));
    }
    setInitialContent(content);
    setJournalView("saved");
  };

  const backButton = (onPress: () => void) => (
    <Pressable accessibilityRole="button" accessibilityLabel={copy.back} style={styles.backButton} onPress={onPress}>
      <WriteIcon name="back" />
      <AppText style={styles.backText}>{copy.back}</AppText>
    </Pressable>
  );

  return (
    <AppScaffold active="journal">
      <View style={styles.shell}>
        {article ? (
          <ArticleDetail article={article} copy={copy} onBack={() => setArticle(null)} />
        ) : (
          <>
            <View style={styles.segmented} accessibilityRole="tablist">
              <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "journal" }} style={[styles.segment, tab === "journal" && styles.segmentActive]} onPress={() => { setTab("journal"); setArticle(null); }}>
                <AppText style={[styles.segmentText, tab === "journal" && styles.segmentTextActive]}>{copy.myJournal}</AppText>
              </Pressable>
              <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "science" }} style={[styles.segment, tab === "science" && styles.segmentActive]} onPress={() => { setTab("science"); setJournalView("home"); }}>
                <AppText style={[styles.segmentText, tab === "science" && styles.segmentTextActive]}>{copy.science}</AppText>
              </Pressable>
            </View>

            {tab === "science" ? (
              <ScienceInsights copy={copy} articles={articles} filter={scienceFilter} onFilter={setScienceFilter} onOpen={setArticle} />
            ) : journalView === "home" ? (
              <JournalHome copy={copy} entries={entries} onCategory={openCategory} onLibrary={() => setJournalView("library")} onOpen={openEntry} />
            ) : journalView === "setup" ? (
              <HeavenlySetup copy={copy} recipient={recipient} prompt={selectedPrompt} onRecipient={setRecipient} onPrompt={setSelectedPrompt} onBack={() => setJournalView("home")} onStart={() => setJournalView("editor")} />
            ) : journalView === "editor" ? (
              <>
                {backButton(requestEditorBack)}
                <JournalEditor copy={copy} category={category} recipient={recipient} prompt={selectedPrompt} content={content} validation={validation} onContent={(value: string) => { setContent(value); setValidation(""); }} onChangeRecipient={() => setJournalView("setup")} onSave={saveEntry} onDelete={() => editingId ? setConfirm("delete") : requestEditorBack()} />
              </>
            ) : journalView === "saved" ? (
              <SavedState copy={copy} heavenly={category === "heavenly-conversation"} onLibrary={() => { resetDraft(); setJournalView("library"); }} onAnother={() => { resetDraft(); setJournalView("home"); }} />
            ) : journalView === "library" ? (
              <>
                {backButton(() => setJournalView("home"))}
                <JournalLibrary copy={copy} entries={filteredEntries} filter={journalFilter} onFilter={setJournalFilter} onOpen={openEntry} onWrite={() => setJournalView("home")} />
              </>
            ) : selectedEntry ? (
              <>
                {backButton(() => setJournalView("library"))}
                <EntryDetail copy={copy} entry={selectedEntry} onEdit={() => editEntry(selectedEntry)} onDelete={() => setConfirm("delete")} />
              </>
            ) : null}
          </>
        )}
      </View>

      <ConfirmDialog visible={confirm !== null} title={confirm === "leave" ? copy.leaveTitle : copy.deleteTitle} text={confirm === "leave" ? copy.leaveText : copy.deleteText} cancel={confirm === "leave" ? copy.keepWriting : copy.cancel} action={confirm === "leave" ? copy.discard : copy.delete} onCancel={() => setConfirm(null)} onAction={() => {
        if (confirm === "leave") leaveEditor();
        else {
          const id = editingId ?? selectedEntryId;
          if (id) deleteJournalEntry(id);
          resetDraft();
          setSelectedEntryId(null);
          setJournalView("library");
        }
        setConfirm(null);
      }} />
    </AppScaffold>
  );
}

function JournalHome({ copy, entries, onCategory, onLibrary, onOpen }: any) {
  return <View>
    <AppText style={styles.displayTitle}>{copy.myJournal}</AppText>
    <AppText style={styles.intro}>{copy.journalIntro}</AppText>
    <View style={styles.heroCard}>
      <AppText style={styles.heroTitle}>{copy.writeHeading}</AppText>
      <AppText style={styles.sectionLabel}>{copy.choose}</AppText>
      <View style={styles.categoryList}>{categoryOrder.map((key) => {
        const item = copy.categories[key];
        return <Pressable key={key} accessibilityRole="button" style={styles.categoryCard} onPress={() => onCategory(key)}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryTint[key] }]}><AppText style={styles.categoryGlyph}>{categoryGlyph[key]}</AppText></View>
          <View style={styles.flex}><AppText style={styles.categoryTitle}>{item.title}</AppText><AppText style={styles.categoryDescription}>{item.description}</AppText></View>
          <WriteIcon name="chevron" size={19} color="#AE8C7E" />
        </Pressable>;
      })}</View>
    </View>
    <View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>{copy.reflections}</AppText><Pressable accessibilityRole="button" onPress={onLibrary}><AppText style={styles.linkText}>{copy.viewLibrary}</AppText></Pressable></View>
    {entries.length === 0 ? <EmptyState copy={copy} onWrite={() => onCategory("free-thoughts")} /> : <View style={styles.entryList}>{entries.slice(0, 3).map((entry: JournalEntry) => <EntryCard key={entry.id} entry={entry} copy={copy} onPress={() => onOpen(entry)} />)}</View>}
    <View style={styles.privacyRow}><WriteIcon name="lock" size={17} color="#9C7A6C" /><AppText style={styles.privacyText}>{copy.privacy}</AppText></View>
  </View>;
}

function HeavenlySetup({ copy, recipient, prompt, onRecipient, onPrompt, onBack, onStart }: any) {
  const item = copy.categories["heavenly-conversation"];
  return <View>{<Pressable accessibilityRole="button" accessibilityLabel={copy.back} style={styles.backButton} onPress={onBack}><WriteIcon name="back" /><AppText style={styles.backText}>{copy.back}</AppText></Pressable>}
    <AppText style={styles.displayTitle}>{item.title}</AppText><AppText style={styles.intro}>{item.support}</AppText>
    <AppText style={styles.fieldLabel}>{copy.who}</AppText><TextInput accessibilityLabel={copy.who} value={recipient} onChangeText={onRecipient} placeholder={copy.recipientPlaceholder} placeholderTextColor="#B49E93" style={styles.singleInput} />
    <AppText style={styles.fieldLabel}>{copy.startingPoint}</AppText><View style={styles.promptGrid}>{copy.heavenlyPrompts.map((text: string) => <Pressable key={text} accessibilityRole="button" accessibilityState={{ selected: prompt === text }} style={[styles.promptCard, prompt === text && styles.promptCardActive]} onPress={() => onPrompt(prompt === text ? "" : text)}><AppText style={styles.promptText}>{text}</AppText></Pressable>)}</View>
    <SoftButton title={copy.startWriting} onPress={onStart} />
  </View>;
}

function JournalEditor({ copy, category, recipient, prompt, content, validation, onContent, onChangeRecipient, onSave, onDelete }: any) {
  const item = copy.categories[category];
  return <View><AppText style={styles.displayTitle}>{item.title}</AppText><AppText style={styles.intro}>{item.support}</AppText>
    {category === "heavenly-conversation" && recipient ? <View style={styles.recipientRow}><AppText style={styles.recipientText}>{copy.writingTo}: {recipient}</AppText><Pressable accessibilityRole="button" onPress={onChangeRecipient}><AppText style={styles.linkText}>{copy.change}</AppText></Pressable></View> : null}
    {(prompt || item.prompt) ? <View style={styles.guidanceCard}><AppText style={styles.guidanceText}>{prompt || item.prompt}</AppText></View> : null}
    <AppText nativeID="journal-content-label" style={styles.fieldLabel}>{item.title}</AppText>
    <View style={styles.paper}><TextInput aria-labelledby="journal-content-label" accessibilityLabel={item.title} multiline textAlignVertical="top" value={content} onChangeText={onContent} placeholder={item.placeholder} placeholderTextColor="#B9A39A" style={styles.textarea} maxLength={20000} /><AppText style={styles.characterCount}>{content.length} {copy.characters}</AppText></View>
    {validation ? <AppText accessibilityLiveRegion="polite" style={styles.validation}>{validation}</AppText> : null}
    <SoftButton title={copy.save} onPress={onSave} disabled={!content.trim()} />
    <Pressable accessibilityRole="button" style={styles.deleteButton} onPress={onDelete}><WriteIcon name="trash" size={19} color="#A06F61" /><AppText style={styles.deleteText}>{copy.delete}</AppText></Pressable>
  </View>;
}

function SavedState({ copy, heavenly, onLibrary, onAnother }: any) {
  return <View style={styles.savedCard}><View style={styles.savedIcon}><WriteIcon name="check" size={48} color="#8F6B5C" /></View><AppText style={styles.savedTitle}>{copy.savedTitle}</AppText><AppText style={styles.savedText}>{heavenly ? copy.heavenlySaved : copy.savedText}</AppText><SoftButton title={copy.viewInLibrary} onPress={onLibrary} /><View style={styles.secondaryAction}><SoftButton title={copy.writeAnother} variant="secondary" onPress={onAnother} /></View></View>;
}

function JournalLibrary({ copy, entries, filter, onFilter, onOpen, onWrite }: any) {
  return <View><AppText style={styles.displayTitle}>{copy.myJournal}</AppText><FilterBar labels={copy.filters} values={journalFilters} selected={filter} onSelect={onFilter} />
    {entries.length === 0 ? <EmptyState copy={copy} onWrite={onWrite} /> : <View style={styles.entryList}>{entries.map((entry: JournalEntry) => <EntryCard key={entry.id} entry={entry} copy={copy} onPress={() => onOpen(entry)} />)}</View>}
  </View>;
}

function EntryCard({ entry, copy, onPress }: { entry: JournalEntry; copy: any; onPress: () => void }) {
  const category = entry.category ?? "free-thoughts";
  const label = copy.categories[category].title;
  return <Pressable accessibilityRole="button" style={styles.entryCard} onPress={onPress}><View style={[styles.entryDot, { backgroundColor: categoryTint[category] }]}><AppText style={styles.entryDotGlyph}>{categoryGlyph[category]}</AppText></View><View style={styles.flex}>{entry.recipientName ? <AppText style={styles.entryTitle}>{entry.recipientName}</AppText> : null}<AppText style={styles.entryCategory}>{label}</AppText><AppText numberOfLines={2} style={styles.entryPreview}>{entry.text}</AppText><AppText style={styles.entryDate}>{formatDate(entry.createdAt)}{entry.updatedAt ? ` · ${copy.edited}` : ""}</AppText></View><WriteIcon name="chevron" size={18} color="#B09588" /></Pressable>;
}

function EntryDetail({ copy, entry, onEdit, onDelete }: { copy: any; entry: JournalEntry; onEdit: () => void; onDelete: () => void }) {
  const category = entry.category ?? "free-thoughts";
  return <View><View style={styles.detailCard}><View style={[styles.detailIcon, { backgroundColor: categoryTint[category] }]}><AppText style={styles.categoryGlyph}>{categoryGlyph[category]}</AppText></View>{entry.recipientName ? <AppText style={styles.detailTitle}>{entry.recipientName}</AppText> : null}<AppText style={styles.detailCategory}>{copy.categories[category].title}</AppText><AppText style={styles.detailDate}>{formatDate(entry.createdAt)}</AppText><View style={styles.detailDivider} /><AppText style={styles.detailBody}>{entry.text}</AppText></View><View style={styles.detailActions}><Pressable accessibilityRole="button" style={styles.outlineAction} onPress={onEdit}><WriteIcon name="edit" /><AppText style={styles.outlineActionText}>{copy.edit}</AppText></Pressable><Pressable accessibilityRole="button" style={styles.outlineAction} onPress={onDelete}><WriteIcon name="trash" color="#A06F61" /><AppText style={styles.deleteText}>{copy.delete}</AppText></Pressable></View></View>;
}

function EmptyState({ copy, onWrite }: any) { return <View style={styles.emptyCard}><WriteIcon name="book" size={38} color="#A58172" /><AppText style={styles.emptyTitle}>{copy.emptyTitle}</AppText><AppText style={styles.emptyText}>{copy.emptyText}</AppText><Pressable accessibilityRole="button" style={styles.smallButton} onPress={onWrite}><AppText style={styles.smallButtonText}>{copy.writeReflection}</AppText></Pressable></View>; }

function ScienceInsights({ copy, articles, filter, onFilter, onOpen }: any) {
  const visible = articles.filter((item: ScienceArticle) => filter === "all" || item.category === filter);
  return <View><AppText style={styles.displayTitle}>{copy.science}</AppText><AppText style={styles.intro}>{copy.scienceIntro}</AppText><FilterBar labels={copy.scienceFilters} values={scienceFilters} selected={filter} onSelect={onFilter} /><View style={styles.articleList}>{visible.map((item: ScienceArticle, index: number) => <Pressable key={item.id} accessibilityRole="button" style={styles.articleCard} onPress={() => onOpen(item)}><View style={[styles.articleThumb, { backgroundColor: ["#F2D9D2", "#E6ECE0", "#E4EAF1", "#F2E5D2"][index % 4] }]}><View style={styles.botanicalLine} /><View style={styles.botanicalLineTwo} /></View><View style={styles.flex}><AppText style={styles.articleCategory}>{copy.scienceFilters[scienceFilters.indexOf(item.category)]}</AppText><AppText style={styles.articleTitle}>{item.title}</AppText><AppText style={styles.articleExcerpt}>{item.excerpt}</AppText><AppText style={styles.articleMeta}>{item.readTime} {copy.minRead}</AppText></View><WriteIcon name="chevron" size={18} color="#AE8C7E" /></Pressable>)}</View></View>;
}

function ArticleDetail({ article, copy, onBack }: any) {
  return <View>{<Pressable accessibilityRole="button" accessibilityLabel={copy.articleBack} style={styles.backButton} onPress={onBack}><WriteIcon name="back" /><AppText style={styles.backText}>{copy.articleBack}</AppText></Pressable>}<View style={styles.articleHero}><View style={styles.heroSun} /></View><AppText style={styles.articleDetailCategory}>{copy.scienceFilters[scienceFilters.indexOf(article.category)]}</AppText><AppText style={styles.articleDetailTitle}>{article.title}</AppText><AppText style={styles.articleMeta}>{article.readTime} {copy.minRead}</AppText>{article.sections.map((section: any) => <View key={section.heading} style={styles.articleSection}><AppText style={styles.articleSectionTitle}>{section.heading}</AppText><AppText style={styles.articleBody}>{section.body}</AppText></View>)}<View style={styles.sourcesCard}><AppText style={styles.articleSectionTitle}>{copy.sources}</AppText><AppText style={styles.sourcesText}>{copy.sourcesPending}</AppText></View></View>;
}

function FilterBar({ labels, values, selected, onSelect }: any) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{values.map((value: string, index: number) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: selected === value }} style={[styles.filterChip, selected === value && styles.filterChipActive]} onPress={() => onSelect(value)}><AppText style={[styles.filterText, selected === value && styles.filterTextActive]}>{labels[index]}</AppText></Pressable>)}</ScrollView>; }

function ConfirmDialog({ visible, title, text, cancel, action, onCancel, onAction }: any) { return <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}><View style={styles.modalOverlay}><View style={styles.modalCard}><AppText style={styles.modalTitle}>{title}</AppText><AppText style={styles.modalText}>{text}</AppText><View style={styles.modalActions}><Pressable accessibilityRole="button" style={styles.modalCancel} onPress={onCancel}><AppText style={styles.modalCancelText}>{cancel}</AppText></Pressable><Pressable accessibilityRole="button" style={styles.modalDelete} onPress={onAction}><AppText style={styles.modalDeleteText}>{action}</AppText></Pressable></View></View></View></Modal>; }

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }

const styles = StyleSheet.create({
  shell: { width: "100%", maxWidth: 720, alignSelf: "center", paddingBottom: 24 }, flex: { flex: 1 },
  segmented: { flexDirection: "row", backgroundColor: "rgba(241,220,209,.72)", padding: 4, borderRadius: 18, marginBottom: 24 }, segment: { flex: 1, minHeight: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, segmentActive: { backgroundColor: "rgba(255,255,255,.9)", borderWidth: 1, borderColor: "rgba(156,113,94,.14)" }, segmentText: { fontSize: 13, color: "#977B6F", fontWeight: "600" }, segmentTextActive: { color: "#704E40", fontWeight: "800" },
  backButton: { alignSelf: "flex-start", minHeight: 44, flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 8 }, backText: { color: "#8A6A5C", fontSize: 14 },
  displayTitle: { fontFamily: "Georgia", fontSize: 34, lineHeight: 41, color: "#67483B", fontWeight: "600", marginBottom: 7 }, intro: { color: "#9A7A6C", fontSize: 15, lineHeight: 22, marginBottom: 20 },
  heroCard: { backgroundColor: "rgba(255,252,248,.73)", borderRadius: 28, padding: 18, borderWidth: 1, borderColor: "rgba(170,129,109,.15)" }, heroTitle: { fontFamily: "Georgia", color: "#765448", fontSize: 27, lineHeight: 34, marginBottom: 18 }, sectionLabel: { color: "#7E5E51", fontWeight: "700", marginBottom: 11 },
  categoryList: { gap: 10 }, categoryCard: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 12, padding: 11, backgroundColor: "rgba(255,255,255,.78)", borderRadius: 19, borderWidth: 1, borderColor: "rgba(164,120,101,.16)" }, categoryIcon: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" }, categoryGlyph: { fontFamily: "Georgia", fontSize: 26, color: "#846353" }, categoryTitle: { color: "#674B40", fontWeight: "700", fontSize: 15 }, categoryDescription: { color: "#9D8175", fontSize: 12, lineHeight: 18, marginTop: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 12, gap: 12 }, sectionTitle: { fontFamily: "Georgia", fontSize: 22, color: "#6D4C3F", fontWeight: "600" }, linkText: { color: "#9A6654", fontWeight: "700", fontSize: 13 },
  privacyRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 22, paddingVertical: 12 }, privacyText: { color: "#9C8175", fontSize: 12, flexShrink: 1 },
  fieldLabel: { color: "#795A4E", fontSize: 14, fontWeight: "700", marginBottom: 8, marginTop: 7 }, singleInput: { minHeight: 52, backgroundColor: "rgba(255,255,255,.78)", borderWidth: 1, borderColor: "rgba(166,122,103,.2)", borderRadius: 16, paddingHorizontal: 16, color: "#674C40", fontSize: 15, marginBottom: 19 }, promptGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }, promptCard: { width: "48%", flexGrow: 1, minHeight: 112, borderRadius: 20, borderWidth: 1, borderColor: "rgba(166,122,103,.18)", backgroundColor: "rgba(255,255,255,.68)", padding: 14, alignItems: "center", justifyContent: "center" }, promptCardActive: { backgroundColor: "#F5DED4", borderColor: "#C8947F" }, promptText: { textAlign: "center", color: "#785A4D", fontSize: 13, lineHeight: 19 },
  recipientRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(246,225,215,.62)", padding: 13, borderRadius: 15, marginBottom: 12 }, recipientText: { color: "#78594C", fontWeight: "600" }, guidanceCard: { padding: 15, borderLeftWidth: 3, borderColor: "#D2A58F", backgroundColor: "rgba(255,246,239,.74)", borderRadius: 12, marginBottom: 12 }, guidanceText: { color: "#806053", fontFamily: "Georgia", fontSize: 17, lineHeight: 25 }, paper: { backgroundColor: "rgba(255,253,249,.88)", borderRadius: 23, borderWidth: 1, borderColor: "rgba(164,119,101,.17)", marginBottom: 9, overflow: "hidden" }, textarea: { minHeight: 320, padding: 20, color: "#5F473E", fontSize: 16, lineHeight: 26 }, characterCount: { color: "#B0978D", textAlign: "right", fontSize: 12, paddingHorizontal: 16, paddingBottom: 12 }, validation: { color: "#A16F5F", fontSize: 13, marginBottom: 10 }, deleteButton: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 9 }, deleteText: { color: "#A06F61", fontWeight: "700" },
  savedCard: { alignItems: "center", backgroundColor: "rgba(255,255,255,.78)", borderRadius: 28, borderWidth: 1, borderColor: "rgba(165,120,101,.16)", padding: 28, marginTop: 10 }, savedIcon: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#F7E3D8", alignItems: "center", justifyContent: "center", marginBottom: 18 }, savedTitle: { fontFamily: "Georgia", fontSize: 29, color: "#67483B", textAlign: "center", marginBottom: 8 }, savedText: { color: "#97796D", textAlign: "center", lineHeight: 23, marginBottom: 24 }, secondaryAction: { width: "100%", marginTop: 10 },
  filterRow: { gap: 8, paddingVertical: 8, paddingRight: 12, marginBottom: 13 }, filterChip: { minHeight: 38, justifyContent: "center", paddingHorizontal: 14, borderRadius: 19, backgroundColor: "rgba(249,237,229,.8)", borderWidth: 1, borderColor: "rgba(167,124,105,.09)" }, filterChipActive: { backgroundColor: "#9A6E5D" }, filterText: { color: "#92766A", fontSize: 12, fontWeight: "600" }, filterTextActive: { color: "#FFF9F5" },
  entryList: { gap: 10 }, entryCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,.82)", borderRadius: 20, padding: 13, borderWidth: 1, borderColor: "rgba(164,120,101,.14)" }, entryDot: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" }, entryDotGlyph: { color: "#836353", fontFamily: "Georgia", fontSize: 21 }, entryTitle: { color: "#64483C", fontWeight: "800", fontSize: 15 }, entryCategory: { color: "#9B7160", fontWeight: "700", fontSize: 11, textTransform: "uppercase", letterSpacing: .5 }, entryPreview: { color: "#6F584E", fontSize: 13, lineHeight: 19, marginTop: 4 }, entryDate: { color: "#AD958A", fontSize: 11, marginTop: 5 },
  emptyCard: { alignItems: "center", backgroundColor: "rgba(255,255,255,.66)", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(164,120,101,.12)" }, emptyTitle: { fontFamily: "Georgia", color: "#765447", fontSize: 20, textAlign: "center", marginTop: 10 }, emptyText: { color: "#9D8175", textAlign: "center", marginTop: 5, marginBottom: 15 }, smallButton: { minHeight: 44, borderRadius: 22, backgroundColor: "#9A6E5D", paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }, smallButtonText: { color: "#FFF9F4", fontWeight: "700" },
  detailCard: { alignItems: "center", backgroundColor: "rgba(255,255,255,.82)", borderRadius: 27, padding: 24, borderWidth: 1, borderColor: "rgba(164,120,101,.15)" }, detailIcon: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", marginBottom: 12 }, detailTitle: { fontFamily: "Georgia", fontSize: 27, color: "#62463B" }, detailCategory: { color: "#9D7160", fontWeight: "700", marginTop: 3 }, detailDate: { color: "#A68D82", fontSize: 12, marginTop: 6 }, detailDivider: { width: 48, height: 1, backgroundColor: "#DFC7BA", marginVertical: 19 }, detailBody: { alignSelf: "stretch", color: "#5F4A41", fontFamily: "Georgia", fontSize: 17, lineHeight: 28 }, detailActions: { flexDirection: "row", gap: 10, marginTop: 14 }, outlineAction: { flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 1, borderColor: "rgba(150,105,87,.22)", backgroundColor: "rgba(255,255,255,.55)", flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center" }, outlineActionText: { color: "#785A4E", fontWeight: "700" },
  articleList: { gap: 11 }, articleCard: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,.8)", borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(164,120,101,.13)", paddingRight: 12 }, articleThumb: { width: 92, minHeight: 132, alignItems: "center", justifyContent: "center", overflow: "hidden" }, botanicalLine: { width: 55, height: 2, borderRadius: 2, backgroundColor: "rgba(119,91,75,.32)", transform: [{ rotate: "-38deg" }] }, botanicalLineTwo: { width: 32, height: 2, borderRadius: 2, backgroundColor: "rgba(119,91,75,.24)", transform: [{ rotate: "34deg" }], marginTop: 12 }, articleCategory: { color: "#A06F5D", fontWeight: "800", fontSize: 10, textTransform: "uppercase", letterSpacing: .7 }, articleTitle: { fontFamily: "Georgia", color: "#61473D", fontSize: 17, lineHeight: 22, marginTop: 4 }, articleExcerpt: { color: "#92786C", fontSize: 12, lineHeight: 17, marginTop: 4 }, articleMeta: { color: "#A48B80", fontSize: 11, marginTop: 6 },
  articleHero: { height: 180, borderRadius: 26, backgroundColor: "#F1D5CF", overflow: "hidden", justifyContent: "flex-end", alignItems: "center", marginBottom: 18 }, heroSun: { width: 94, height: 94, borderRadius: 47, backgroundColor: "rgba(255,244,218,.78)", marginBottom: -20 }, articleDetailCategory: { color: "#A06F5D", fontWeight: "800", textTransform: "uppercase", fontSize: 11, letterSpacing: .8 }, articleDetailTitle: { fontFamily: "Georgia", fontSize: 34, lineHeight: 41, color: "#60463A", marginTop: 7 }, articleSection: { marginTop: 24 }, articleSectionTitle: { fontFamily: "Georgia", fontSize: 22, color: "#664A3E", marginBottom: 8 }, articleBody: { color: "#66534B", fontSize: 16, lineHeight: 27 }, sourcesCard: { backgroundColor: "rgba(247,233,224,.72)", borderRadius: 19, padding: 17, marginTop: 26 }, sourcesText: { color: "#8D756A", fontSize: 13, lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(70,48,39,.28)", alignItems: "center", justifyContent: "center", padding: 22 }, modalCard: { width: "100%", maxWidth: 420, borderRadius: 25, backgroundColor: "#FFF9F3", padding: 23, borderWidth: 1, borderColor: "rgba(145,103,85,.18)" }, modalTitle: { fontFamily: "Georgia", fontSize: 24, color: "#65493D" }, modalText: { color: "#91766B", marginTop: 8, lineHeight: 22 }, modalActions: { flexDirection: "row", gap: 10, marginTop: 21 }, modalCancel: { flex: 1, minHeight: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#F5E8DF" }, modalCancelText: { color: "#795D51", fontWeight: "700" }, modalDelete: { flex: 1, minHeight: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#B88170" }, modalDeleteText: { color: "white", fontWeight: "800" },
});
