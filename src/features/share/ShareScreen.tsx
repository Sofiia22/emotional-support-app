import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

type ShareChoice = "memory" | "speak" | "write";

const stroke = {
  fill: "none",
  stroke: "#A97867",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.7,
};

function ShareChoiceIcon({ choice }: { choice: ShareChoice }) {
  return (
    <Svg width={48} height={48} viewBox="0 0 52 52" accessibilityElementsHidden>
      {choice === "speak" ? (
        <>
          <Rect {...stroke} x="19" y="7" width="14" height="25" rx="7" />
          <Path {...stroke} d="M14 24a12 12 0 0 0 24 0" />
          <Line {...stroke} x1="26" y1="36" x2="26" y2="44" />
          <Line {...stroke} x1="20" y1="44" x2="32" y2="44" />
          <Path {...stroke} d="M10 17c-3 4-3 11 0 15M42 17c3 4 3 11 0 15" />
        </>
      ) : null}

      {choice === "write" ? (
        <>
          <Rect {...stroke} x="9" y="7" width="27" height="37" rx="4" />
          <Line {...stroke} x1="7" y1="14" x2="13" y2="14" />
          <Line {...stroke} x1="7" y1="22" x2="13" y2="22" />
          <Line {...stroke} x1="7" y1="30" x2="13" y2="30" />
          <Line {...stroke} x1="17" y1="17" x2="28" y2="17" />
          <Line {...stroke} x1="17" y1="24" x2="25" y2="24" />
          <Path {...stroke} d="m29 39 3.2-8.5L42 20.7l4 4-9.8 9.8L29 39Z" />
        </>
      ) : null}

      {choice === "memory" ? (
        <>
          <Path {...stroke} d="M9 9c6-1.4 11.7-.3 17 3.6V44c-5.3-3.9-11-5-17-3.6V9Z" />
          <Path {...stroke} d="M43 9c-6-1.4-11.7-.3-17 3.6V44c5.3-3.9 11-5 17-3.6V9Z" />
          <Path {...stroke} d="M26 31.5s-8-4.4-8-9.5c0-4.2 5.2-5.3 8-1.7 2.8-3.6 8-2.5 8 1.7 0 5.1-8 9.5-8 9.5Z" />
          <Circle {...stroke} cx="12" cy="12" r="1.5" />
          <Circle {...stroke} cx="40" cy="12" r="1.5" />
        </>
      ) : null}
    </Svg>
  );
}

type ChoiceCardProps = {
  choice: ShareChoice;
  title: string;
  onPress: () => void;
};

function ChoiceCard({ choice, title, onPress }: ChoiceCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.choiceCard, pressed && styles.pressed]}
    >
      <View style={styles.iconCircle}>
        <ShareChoiceIcon choice={choice} />
      </View>
      <AppText style={styles.choiceTitle}>{title}</AppText>
      <AppText style={styles.chevron}>›</AppText>
    </Pressable>
  );
}

export function ShareScreen() {
  const router = useRouter();
  const { user } = useRequireUser();
  const { copy } = useApp();

  if (!user) return null;

  const openJournal = (mode: ShareChoice) => {
    router.push({ pathname: "/journal", params: { mode } });
  };

  return (
    <AppScaffold active="journal">
      <View style={styles.intro}>
        <AppText style={styles.prompt}>{copy.home.sharePrompt}</AppText>
        <AppText style={styles.title}>{copy.home.shareTitle}</AppText>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText style={styles.dividerMark}>❧</AppText>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.choiceList}>
        <ChoiceCard
          choice="speak"
          title={copy.home.speak}
          onPress={() => openJournal("speak")}
        />
        <ChoiceCard
          choice="write"
          title={copy.home.write}
          onPress={() => openJournal("write")}
        />
        <ChoiceCard
          choice="memory"
          title={copy.home.saveMemories}
          onPress={() => openJournal("memory")}
        />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  intro: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 18,
  },
  prompt: {
    fontSize: 14,
    color: "#9A7769",
  },
  title: {
    marginTop: 14,
    maxWidth: 340,
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 31,
    lineHeight: 38,
    color: "#65493E",
  },
  divider: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dividerLine: {
    width: 42,
    height: 1,
    backgroundColor: "#E3C6B9",
  },
  dividerMark: {
    fontSize: 18,
    color: "#D4AA98",
  },
  choiceList: {
    gap: 14,
    paddingBottom: 18,
  },
  choiceCard: {
    minHeight: 112,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(189,146,129,0.18)",
    shadowColor: "#8C6B5E",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9E5DF",
  },
  choiceTitle: {
    flex: 1,
    paddingHorizontal: 22,
    fontFamily: "serif",
    fontSize: 27,
    color: "#65493E",
  },
  chevron: {
    marginTop: -3,
    fontSize: 32,
    color: "#B68B7C",
  },
});
