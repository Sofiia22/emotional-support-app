import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { libraryArticles, LibraryArticle } from "@/features/library/libraryContent";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

export function LibraryScreen() {
  const { user } = useRequireUser();
  const { copy, language, favoriteArticleIds, toggleFavoriteArticle } = useApp();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<LibraryArticle | null>(null);

  const visibleArticles = useMemo(
    () =>
      favoritesOnly
        ? libraryArticles.filter((article) => favoriteArticleIds.includes(article.id))
        : libraryArticles,
    [favoriteArticleIds, favoritesOnly],
  );

  if (!user) return null;

  return (
    <AppScaffold active="library" title={copy.library.title} subtitle={copy.library.subtitle}>
      <View style={styles.filters}>
        <Pressable
          style={[styles.filter, !favoritesOnly && styles.filterActive]}
          onPress={() => setFavoritesOnly(false)}
        >
          <AppText style={[styles.filterText, !favoritesOnly && styles.filterTextActive]}>
            {copy.library.all}
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.filter, favoritesOnly && styles.filterActive]}
          onPress={() => setFavoritesOnly(true)}
        >
          <AppText style={[styles.filterText, favoritesOnly && styles.filterTextActive]}>
            ♡ {copy.library.favorites} ({favoriteArticleIds.length})
          </AppText>
        </Pressable>
      </View>

      {visibleArticles.length === 0 ? (
        <View style={styles.emptyCard}>
          <AppText style={styles.emptyIcon}>♡</AppText>
          <AppText style={styles.emptyText}>{copy.library.emptyFavorites}</AppText>
        </View>
      ) : (
        <View style={styles.articleList}>
          {visibleArticles.map((article) => {
            const content = article.content[language];
            const isFavorite = favoriteArticleIds.includes(article.id);
            return (
              <Pressable
                key={article.id}
                accessibilityRole="button"
                style={styles.articleCard}
                onPress={() => setSelected(article)}
              >
                <View style={[styles.articleIcon, { backgroundColor: article.color }]}>
                  <AppText style={styles.articleGlyph}>{article.icon}</AppText>
                </View>
                <View style={styles.articleText}>
                  <AppText style={styles.articleTitle}>{content.title}</AppText>
                  <AppText style={styles.articleSummary}>{content.summary}</AppText>
                  <AppText style={styles.minutes}>{article.minutes} {copy.library.minutes} · {copy.library.read}</AppText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isFavorite ? copy.library.unfavorite : copy.library.favorite}
                  hitSlop={12}
                  onPress={(event) => {
                    event.stopPropagation();
                    toggleFavoriteArticle(article.id);
                  }}
                >
                  <AppText style={[styles.heart, isFavorite && styles.heartActive]}>
                    {isFavorite ? "♥" : "♡"}
                  </AppText>
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.disclaimer}>
        <AppText style={styles.disclaimerText}>{copy.library.disclaimer}</AppText>
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={selected !== null}
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.readerCard}>
            {selected ? (
              <>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <AppText style={styles.readerIcon}>{selected.icon}</AppText>
                  <AppText style={styles.readerTitle}>{selected.content[language].title}</AppText>
                  {selected.content[language].body.map((paragraph) => (
                    <AppText key={paragraph} style={styles.paragraph}>{paragraph}</AppText>
                  ))}
                </ScrollView>
                <View style={styles.readerActions}>
                  <SoftButton
                    title={favoriteArticleIds.includes(selected.id) ? copy.library.unfavorite : copy.library.favorite}
                    variant="secondary"
                    onPress={() => toggleFavoriteArticle(selected.id)}
                  />
                  <SoftButton title={copy.common.close} onPress={() => setSelected(null)} />
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filter: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16, backgroundColor: "#F4EAE3" },
  filterActive: { backgroundColor: "#846356" },
  filterText: { fontSize: 11, fontWeight: "700", color: "#91766A" },
  filterTextActive: { color: "#FFFFFF" },
  articleList: { gap: 11 },
  articleCard: { padding: 15, borderRadius: 22, flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "rgba(255,255,255,0.8)", borderWidth: 1, borderColor: "rgba(173,131,116,0.13)" },
  articleIcon: { width: 48, height: 48, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  articleGlyph: { fontSize: 22, color: "#795C50" },
  articleText: { flex: 1 },
  articleTitle: { fontFamily: "serif", fontSize: 17, fontWeight: "700", color: "#71564A" },
  articleSummary: { marginTop: 3, fontSize: 12, lineHeight: 17, color: "#9B8277" },
  minutes: { marginTop: 7, fontSize: 10, fontWeight: "700", color: "#A17C6D" },
  heart: { padding: 4, fontSize: 24, color: "#BEA49A" },
  heartActive: { color: "#BA716C" },
  emptyCard: { minHeight: 150, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(244,234,223,0.7)" },
  emptyIcon: { fontSize: 30, color: "#B89889" },
  emptyText: { marginTop: 8, paddingHorizontal: 30, textAlign: "center", fontSize: 13, lineHeight: 19, color: "#998178" },
  disclaimer: { marginTop: 16, padding: 13, borderRadius: 16, backgroundColor: "rgba(236,240,229,0.75)" },
  disclaimerText: { fontSize: 11, lineHeight: 17, color: "#758070" },
  modalOverlay: { flex: 1, padding: 18, justifyContent: "flex-end", backgroundColor: "rgba(72,54,47,0.38)" },
  readerCard: { width: "100%", maxWidth: 620, maxHeight: "86%", alignSelf: "center", padding: 22, borderRadius: 28, backgroundColor: "#FFF9F4" },
  readerIcon: { fontSize: 32, color: "#88685A" },
  readerTitle: { marginTop: 10, marginBottom: 18, fontFamily: "serif", fontSize: 28, lineHeight: 35, fontWeight: "700", color: "#6F5548" },
  paragraph: { marginBottom: 16, fontFamily: "serif", fontSize: 16, lineHeight: 25, color: "#725B50" },
  readerActions: { paddingTop: 8, flexDirection: "row", gap: 9 },
});
