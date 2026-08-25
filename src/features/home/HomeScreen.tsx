import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

type FeatureIconName = "anchor" | "book" | "breath" | "journal";

type FeatureCardProps = {
  icon: FeatureIconName;
  title: string;
  hint: string;
  tint: string;
  onPress: () => void;
};

const iconStroke = {
  fill: "none",
  stroke: "#765448",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.75,
};

function FeatureIcon({ name }: { name: FeatureIconName }) {
  return (
    <Svg width={36} height={36} viewBox="0 0 48 48" accessibilityElementsHidden>
      {name === "journal" ? (
        <>
          <Rect {...iconStroke} x="9" y="7" width="25" height="34" rx="4" />
          <Line {...iconStroke} x1="7" y1="14" x2="13" y2="14" />
          <Line {...iconStroke} x1="7" y1="22" x2="13" y2="22" />
          <Line {...iconStroke} x1="7" y1="30" x2="13" y2="30" />
          <Line {...iconStroke} x1="17" y1="17" x2="28" y2="17" />
          <Line {...iconStroke} x1="17" y1="24" x2="26" y2="24" />
          <Path {...iconStroke} d="m27 36 3.1-8.1L39 19l4 4-8.9 8.9L27 36Z" />
          <Line {...iconStroke} x1="35.8" y1="22.2" x2="39.8" y2="26.2" />
        </>
      ) : null}

      {name === "breath" ? (
        <>
          <Path {...iconStroke} d="M7 18h19c5.8 0 6.3-8 1.1-8-2.8 0-4.3 1.7-4.3 4" />
          <Path {...iconStroke} d="M5 25h29c6 0 6.4-8.3 1.1-8.3-2.7 0-4.4 1.8-4.4 4" />
          <Path {...iconStroke} d="M9 32h17c5.8 0 6.3 8 1.1 8-2.8 0-4.3-1.7-4.3-4" />
        </>
      ) : null}

      {name === "anchor" ? (
        <>
          <Circle {...iconStroke} cx="24" cy="10" r="5" />
          <Line {...iconStroke} x1="24" y1="15" x2="24" y2="39" />
          <Line {...iconStroke} x1="17" y1="20" x2="31" y2="20" />
          <Path {...iconStroke} d="M9 29c2.5 7 7.6 10.5 15 10.5S36.5 36 39 29" />
          <Path {...iconStroke} d="m6.5 32.5 2.5-4 4 2" />
          <Path {...iconStroke} d="m41.5 32.5-2.5-4-4 2" />
        </>
      ) : null}

      {name === "book" ? (
        <>
          <Path {...iconStroke} d="M5 10h4v27H5z" />
          <Path {...iconStroke} d="M43 10h-4v27h4z" />
          <Path {...iconStroke} d="M9 8c6.8-1.2 11.8.2 15 4.2V39c-3.2-4-8.2-5.4-15-4.2V8Z" />
          <Path {...iconStroke} d="M39 8c-6.8-1.2-11.8.2-15 4.2V39c3.2-4 8.2-5.4 15-4.2V8Z" />
        </>
      ) : null}
    </Svg>
  );
}

function FeatureCard({ icon, title, hint, tint, onPress }: FeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${hint}`}
      style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.featureIcon, { backgroundColor: tint }]}>
        <FeatureIcon name={icon} />
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
  const { copy } = useApp();

  if (!user) return null;

  return (
    <AppScaffold active="home">
      <View style={styles.featureList}>
        <FeatureCard
          icon="journal"
          title={copy.home.share}
          hint={copy.home.shareHint}
          tint="#F6D8D5"
          onPress={() => router.push("/journal")}
        />
        <FeatureCard
          icon="breath"
          title={copy.home.justBe}
          hint={copy.home.justBeHint}
          tint="#D9EDF1"
          onPress={() => router.push("/breathe")}
        />
        <FeatureCard
          icon="anchor"
          title={copy.home.learn}
          hint={copy.home.learnHint}
          tint="#E7E2F3"
          onPress={() => router.push("/breathe")}
        />
        <FeatureCard
          icon="book"
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
  featureList: {
    marginTop: 8,
    gap: 10,
  },
  featureCard: {
    minHeight: 92,
    padding: 12,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(173,131,116,0.14)",
    shadowColor: "#8C6B5E",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  featureIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    paddingHorizontal: 12,
  },
  featureTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: "#65483C",
  },
  featureHint: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    color: "#9C7C6F",
  },
  chevron: {
    marginTop: -3,
    fontSize: 30,
    color: "#B68B7C",
  },
});
