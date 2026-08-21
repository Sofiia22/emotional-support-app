import { StyleSheet, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

export function PrivacyScreen() {
  const { user } = useRequireUser();
  const { copy } = useApp();

  if (!user) return null;

  const sections = [
    [copy.privacy.localTitle, copy.privacy.localText, "⌂"],
    [copy.privacy.sharingTitle, copy.privacy.sharingText, "↗"],
    [copy.privacy.servicesTitle, copy.privacy.servicesText, "○"],
    [copy.privacy.deleteTitle, copy.privacy.deleteText, "✓"],
  ] as const;

  return (
    <AppScaffold active="home" title={copy.privacy.title} subtitle={copy.privacy.subtitle}>
      <View style={styles.list}>
        {sections.map(([title, body, icon]) => (
          <View key={title} style={styles.card}>
            <View style={styles.icon}>
              <AppText style={styles.iconText}>{icon}</AppText>
            </View>
            <View style={styles.content}>
              <AppText style={styles.title}>{title}</AppText>
              <AppText style={styles.body}>{body}</AppText>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.draftCard}>
        <AppText style={styles.draft}>ⓘ {copy.privacy.draft}</AppText>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 11 },
  card: { padding: 16, borderRadius: 22, flexDirection: "row", gap: 13, backgroundColor: "rgba(255,255,255,0.8)", borderWidth: 1, borderColor: "rgba(173,131,116,0.14)" },
  icon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#E8EDE3" },
  iconText: { fontSize: 18, fontWeight: "700", color: "#6F7D6A" },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#70564B" },
  body: { marginTop: 5, fontSize: 12, lineHeight: 19, color: "#927C72" },
  draftCard: { marginTop: 15, padding: 14, borderRadius: 17, backgroundColor: "rgba(244,231,204,0.65)" },
  draft: { fontSize: 11, lineHeight: 17, color: "#8E7A5E" },
});
