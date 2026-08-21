import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { JournalEntry, useApp } from "@/shared/state/AppProvider";

const localeByLanguage = {
  en: "en-US",
  uk: "uk-UA",
  ru: "ru-RU",
} as const;

export function JournalScreen() {
  const { user } = useRequireUser();
  const {
    copy,
    language,
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  } = useApp();
  const [entry, setEntry] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(localeByLanguage[language], {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [language],
  );
  const filteredEntries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(localeByLanguage[language]);
    if (!query) return journalEntries;
    return journalEntries.filter((item) =>
      item.text.toLocaleLowerCase(localeByLanguage[language]).includes(query),
    );
  }, [journalEntries, language, search]);

  if (!user) return null;

  const saveEntry = () => {
    if (!entry.trim()) return;
    addJournalEntry(entry);
    setEntry("");
    setIsSaved(true);
  };

  const exportJournal = async () => {
    const body = journalEntries
      .map(
        (item) =>
          `${dateFormatter.format(new Date(item.createdAt))}\n${item.text}`,
      )
      .join("\n\n———\n\n");
    await Share.share({
      title: copy.journal.exportTitle,
      message: `${copy.journal.exportTitle}\n\n${body}`,
    });
  };

  const confirmDelete = (id: string) => {
    Alert.alert(copy.journal.deleteTitle, copy.journal.deleteMessage, [
      { text: copy.common.cancel, style: "cancel" },
      {
        text: copy.common.delete,
        style: "destructive",
        onPress: () => deleteJournalEntry(id),
      },
    ]);
  };

  return (
    <AppScaffold
      active="journal"
      title={copy.journal.title}
      subtitle={copy.journal.subtitle}
    >
      <View style={styles.editorCard}>
        <View style={styles.editorHeading}>
          <View style={styles.editorIcon}>
            <AppText style={styles.editorGlyph}>✎</AppText>
          </View>
          <AppText style={styles.prompt}>{copy.journal.prompt}</AppText>
        </View>
        <TextInput
          accessibilityLabel={copy.journal.placeholder}
          multiline
          placeholder={copy.journal.placeholder}
          placeholderTextColor="#B9A39A"
          style={styles.input}
          textAlignVertical="top"
          value={entry}
          onChangeText={(value) => {
            setEntry(value);
            setIsSaved(false);
          }}
        />
        <SoftButton
          disabled={!entry.trim()}
          title={copy.journal.saveEntry}
          onPress={saveEntry}
        />
        {isSaved ? (
          <AppText accessibilityLiveRegion="polite" style={styles.saved}>
            ✓ {copy.journal.saved}
          </AppText>
        ) : null}
      </View>

      <View style={styles.privacyNote}>
        <AppText style={styles.privacyText}>🔒 {copy.journal.deleteHint}</AppText>
      </View>

      <View style={styles.recentHeader}>
        <AppText style={styles.recentTitle}>{copy.journal.recent}</AppText>
        {journalEntries.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            style={styles.exportButton}
            onPress={exportJournal}
          >
            <AppText style={styles.exportButtonText}>
              ↗ {copy.common.share}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {journalEntries.length > 0 ? (
        <View style={styles.searchWrap}>
          <AppText style={styles.searchLabel}>{copy.journal.search}</AppText>
          <TextInput
            accessibilityLabel={copy.journal.search}
            placeholder={copy.journal.searchPlaceholder}
            placeholderTextColor="#B29B91"
            returnKeyType="search"
            value={search}
            style={styles.searchInput}
            onChangeText={setSearch}
          />
          {search.trim() ? (
            <AppText style={styles.resultCount}>
              {filteredEntries.length} {copy.journal.results}
            </AppText>
          ) : null}
        </View>
      ) : null}
      {journalEntries.length === 0 ? (
        <View style={styles.emptyCard}>
          <AppText style={styles.emptyIcon}>☁</AppText>
          <AppText style={styles.emptyText}>{copy.journal.empty}</AppText>
        </View>
      ) : filteredEntries.length === 0 ? (
        <View style={styles.emptyCard}>
          <AppText style={styles.emptyIcon}>⌕</AppText>
          <AppText style={styles.emptyText}>{copy.journal.noResults}</AppText>
        </View>
      ) : (
        <View style={styles.entries}>
          {filteredEntries.slice(0, 20).map((item) => (
            <View key={item.id} style={styles.entryCard}>
              <AppText style={styles.entryDate}>
                {dateFormatter.format(new Date(item.createdAt))}
              </AppText>
              <AppText numberOfLines={5} style={styles.entryText}>
                {item.text}
              </AppText>
              {item.updatedAt ? (
                <AppText style={styles.editedLabel}>{copy.journal.edited}</AppText>
              ) : null}
              <View style={styles.entryActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setEditingEntry(item);
                    setEditText(item.text);
                  }}
                >
                  <AppText style={styles.editAction}>✎ {copy.common.edit}</AppText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => confirmDelete(item.id)}
                >
                  <AppText style={styles.deleteAction}>× {copy.common.delete}</AppText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={editingEntry !== null}
        onRequestClose={() => setEditingEntry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <AppText style={styles.editTitle}>{copy.common.edit}</AppText>
            <TextInput
              accessibilityLabel={copy.common.edit}
              multiline
              autoFocus
              value={editText}
              style={styles.editInput}
              textAlignVertical="top"
              onChangeText={setEditText}
            />
            <View style={styles.modalActions}>
              <SoftButton
                title={copy.common.cancel}
                variant="secondary"
                onPress={() => setEditingEntry(null)}
              />
              <SoftButton
                disabled={!editText.trim()}
                title={copy.common.save}
                onPress={() => {
                  if (!editingEntry || !editText.trim()) return;
                  updateJournalEntry(editingEntry.id, editText);
                  setEditingEntry(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  editorCard: {
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(173,131,116,0.16)",
  },
  editorHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editorIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5DCD5",
  },
  editorGlyph: {
    fontSize: 19,
    color: "#79574A",
  },
  prompt: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: "#75584C",
  },
  input: {
    minHeight: 170,
    marginVertical: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9DCD4",
    backgroundColor: "#FFFCFA",
    fontFamily: "serif",
    fontSize: 17,
    lineHeight: 26,
    color: "#674D42",
  },
  saved: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#66806B",
  },
  privacyNote: {
    marginTop: 12,
    padding: 13,
    borderRadius: 16,
    backgroundColor: "rgba(236, 240, 229, 0.76)",
  },
  privacyText: {
    fontSize: 11,
    lineHeight: 17,
    color: "#758070",
  },
  recentHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  recentTitle: {
    flex: 1,
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "700",
    color: "#705448",
  },
  exportButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F1E3DA",
  },
  exportButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#815F51",
  },
  searchWrap: {
    marginBottom: 13,
  },
  searchLabel: {
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "700",
    color: "#8A7065",
  },
  searchInput: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6D9D1",
    backgroundColor: "rgba(255,255,255,0.82)",
    fontSize: 14,
    color: "#684F44",
  },
  resultCount: {
    marginTop: 6,
    fontSize: 10,
    color: "#A1887C",
  },
  emptyCard: {
    minHeight: 130,
    padding: 22,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244,234,223,0.62)",
  },
  emptyIcon: {
    fontSize: 28,
    color: "#B89889",
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: "#998178",
  },
  entries: {
    gap: 10,
  },
  entryCard: {
    padding: 17,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderLeftWidth: 3,
    borderLeftColor: "#E6C5BA",
  },
  entryDate: {
    fontSize: 11,
    fontWeight: "700",
    color: "#AD8B7C",
  },
  entryText: {
    marginTop: 7,
    fontFamily: "serif",
    fontSize: 15,
    lineHeight: 22,
    color: "#6E564B",
  },
  editedLabel: {
    marginTop: 6,
    fontSize: 10,
    color: "#AA9287",
  },
  entryActions: {
    marginTop: 13,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EFE5DF",
    flexDirection: "row",
    gap: 22,
  },
  editAction: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7C695E",
  },
  deleteAction: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B16F68",
  },
  modalOverlay: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
    backgroundColor: "rgba(72, 54, 47, 0.38)",
  },
  editModal: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    padding: 20,
    borderRadius: 26,
    backgroundColor: "#FFF9F4",
  },
  editTitle: {
    fontFamily: "serif",
    fontSize: 24,
    fontWeight: "700",
    color: "#705448",
  },
  editInput: {
    minHeight: 190,
    marginVertical: 16,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5D7CF",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    color: "#674D42",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
});
