import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

const moodIcons = ["☂", "◔", "○", "☀", "✦"];

type FeatureCardProps = {
  icon: string;
  title: string;
  hint: string;
  tint: string;
  onPress: () => void;
};

function FeatureCard({ icon, title, hint, tint, onPress }: FeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.featureIcon, { backgroundColor: tint }]}>
        <AppText style={styles.featureGlyph}>{icon}</AppText>
      </View>
      <View style={styles.featureText}>
        <AppText style={styles.featureTitle}>{title}</AppText>
        <AppText style={styles.featureHint}>{hint}</AppText>
      </View>
      <AppText style={styles.chevron}>›</AppText>
    </Pressable>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const { user } = useRequireUser();
  const {
    copy,
    mood,
    moodHistory,
    setMood,
    journalEntries,
    breathingSessions,
  } = useApp();

  if (!user) return null;

  return (
    <AppScaffold active="home">
      <View style={styles.greetingBlock}>
        <AppText style={styles.question}>{copy.home.question}</AppText>
      </View>

      <View style={styles.moodCard}>
        <AppText style={styles.moodPrompt}>{copy.home.moodPrompt}</AppText>
        <View style={styles.moodRow}>
          {moodIcons.map((icon, index) => {
            const isSelected = mood === index;
            const label = copy.home.moods[index];

            return (
              <Pressable
                key={icon}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: isSelected }}
                style={styles.moodOption}
                onPress={() => setMood(index)}
              >
                <View
                  style={[
                    styles.moodIcon,
                    isSelected && styles.moodIconSelected,
                  ]}
                >
                  <AppText
                    style={[
                      styles.moodGlyph,
                      isSelected && styles.moodGlyphSelected,
                    ]}
                  >
                    {icon}
                  </AppText>
                </View>
                <AppText
                  numberOfLines={2}
                  style={[
                    styles.moodLabel,
                    isSelected && styles.moodLabelSelected,
                  ]}
                >
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {mood !== null ? (
          <AppText style={styles.savedMessage}>✓ {copy.home.moodSaved}</AppText>
        ) : null}
      </View>

      <View style={styles.historyCard}>
        <AppText style={styles.historyTitle}>{copy.home.moodHistory}</AppText>
        {moodHistory.length === 0 ? (
          <AppText style={styles.historyEmpty}>{copy.home.moodHistoryEmpty}</AppText>
        ) : (
          <View style={styles.historyRow}>
            {moodHistory.slice(0, 7).reverse().map((item) => (
              <View
                key={item.id}
                accessible
                accessibilityLabel={`${item.id}: ${copy.home.moods[item.mood]}`}
                style={styles.historyItem}
              >
                <View style={styles.historyDot}>
                  <AppText style={styles.historyGlyph}>{moodIcons[item.mood]}</AppText>
                </View>
                <AppText style={styles.historyDate}>{item.id.slice(5)}</AppText>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <AppText style={styles.statValue}>{journalEntries.length}</AppText>
          <AppText style={styles.statLabel}>{copy.home.journalEntries}</AppText>
        </View>
        <View style={styles.statCard}>
          <AppText style={styles.statValue}>{breathingSessions}</AppText>
          <AppText style={styles.statLabel}>
            {copy.home.breathingSessions}
          </AppText>
        </View>
      </View>

      <View style={styles.featureList}>
        <FeatureCard
          icon="✎"
          title={copy.home.share}
          hint={copy.home.shareHint}
          tint="#F6D8D5"
          onPress={() => router.push("/journal")}
        />
        <FeatureCard
          icon="◌"
          title={copy.home.justBe}
          hint={copy.home.justBeHint}
          tint="#D9EDF1"
          onPress={() => router.push("/breathe")}
        />
        <FeatureCard
          icon="◇"
          title={copy.home.learn}
          hint={copy.home.learnHint}
          tint="#E7E2F3"
          onPress={() => router.push("/breathe")}
        />
        <FeatureCard
          icon="♡"
          title={copy.home.read}
          hint={copy.home.readHint}
          tint="#F5E7C8"
          onPress={() => router.push("/library" as Href)}
        />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  greetingBlock: {
    marginTop: 12,
    marginBottom: 20,
  },
  question: {
    maxWidth: 350,
    fontFamily: "serif",
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "700",
    color: "#6F5548",
  },
  moodCard: {
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(173,131,116,0.16)",
  },
  moodPrompt: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#876A5D",
  },
  moodRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  moodOption: {
    flex: 1,
    alignItems: "center",
  },
  moodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6EDE6",
  },
  moodIconSelected: {
    backgroundColor: "#8B6657",
    transform: [{ scale: 1.06 }],
  },
  moodGlyph: {
    fontSize: 21,
    color: "#A77B6C",
  },
  moodGlyphSelected: {
    color: "#FFFFFF",
  },
  moodLabel: {
    marginTop: 7,
    minHeight: 28,
    textAlign: "center",
    fontSize: 9,
    lineHeight: 12,
    color: "#A38B80",
  },
  moodLabelSelected: {
    fontWeight: "700",
    color: "#77564A",
  },
  savedMessage: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#6E8A73",
  },
  historyCard: {
    marginTop: 14,
    padding: 15,
    borderRadius: 21,
    backgroundColor: "rgba(232, 237, 224, 0.66)",
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#76806F",
  },
  historyEmpty: {
    marginTop: 6,
    fontSize: 11,
    color: "#92998A",
  },
  historyRow: {
    marginTop: 11,
    flexDirection: "row",
    gap: 8,
  },
  historyItem: {
    flex: 1,
    alignItems: "center",
  },
  historyDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFFB8",
  },
  historyGlyph: {
    fontSize: 16,
    color: "#7C7465",
  },
  historyDate: {
    marginTop: 4,
    fontSize: 8,
    color: "#8E9386",
  },
  statsRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minHeight: 86,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "rgba(245, 230, 211, 0.72)",
  },
  statValue: {
    fontFamily: "serif",
    fontSize: 27,
    fontWeight: "700",
    color: "#795A4D",
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: "#9A7E71",
  },
  featureList: {
    marginTop: 18,
    gap: 11,
  },
  featureCard: {
    minHeight: 92,
    padding: 14,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(173,131,116,0.14)",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  featureGlyph: {
    fontSize: 24,
    color: "#765448",
  },
  featureText: {
    flex: 1,
    paddingHorizontal: 14,
  },
  featureTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: "#71564A",
  },
  featureHint: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#9C857A",
  },
  chevron: {
    marginTop: -3,
    fontSize: 30,
    color: "#BDA69B",
  },
});
