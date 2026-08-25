import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  Keyframe,
  useReducedMotion,
} from "react-native-reanimated";

import { LanguageSelector } from "@/components/common/LanguageSelector";
import { AppText, SoftButton } from "@/components/ui";
import { GrowingPlekaiMark } from "@/features/splash/GrowingPlekaiMark";
import { useApp } from "@/shared/state/AppProvider";

const taglineImage = require("../../assets/logo/animated/tagline.png");
const wordmarkImage = require("../../assets/logo/animated/wordmark.png");

export function WelcomeScreen() {
  const router = useRouter();
  const { copy } = useApp();
  const reducedMotion = useReducedMotion();

  const logoEntering = reducedMotion
    ? FadeIn.duration(250)
    : new Keyframe({
        0: {
          opacity: 0,
          transform: [{ translateY: 150 }, { scale: 1.04 }],
        },
        100: {
          opacity: 1,
          transform: [{ translateY: 0 }, { scale: 1 }],
        },
      }).duration(1700);

  const fromLeft = (delay: number) =>
    reducedMotion
      ? FadeIn.delay(delay).duration(220)
      : FadeInLeft.delay(delay)
          .duration(900)
          .easing(Easing.out(Easing.cubic));

  const fromRight = (delay: number) =>
    reducedMotion
      ? FadeIn.delay(delay).duration(220)
      : FadeInRight.delay(delay)
          .duration(900)
          .easing(Easing.out(Easing.cubic));

  return (
    <View style={styles.screen}>
      <View style={styles.peachWash} />
      <View style={styles.blueWash} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <Animated.View entering={logoEntering} style={styles.brandInner}>
            <View style={styles.markViewport}>
              <View style={styles.markScale}>
                <GrowingPlekaiMark reducedMotion />
              </View>
            </View>

            <Animated.Image
              source={wordmarkImage}
              resizeMode="contain"
              style={styles.wordmark}
            />
            <Animated.Image
              source={taglineImage}
              resizeMode="contain"
              style={styles.brandTagline}
            />
          </Animated.View>
        </View>

        <View style={styles.textBlock}>
          <Animated.View entering={fromLeft(550)}>
            <AppText style={styles.title}>{copy.welcome.title}</AppText>
          </Animated.View>

          <Animated.View entering={fromRight(720)}>
            <AppText style={styles.description}>
              {copy.welcome.description}
            </AppText>
          </Animated.View>
        </View>

        <View style={styles.actions}>
          <Animated.View entering={fromLeft(850)}>
            <SoftButton
              title={copy.welcome.getStarted}
              onPress={() =>
                router.push({ pathname: "/auth", params: { mode: "register" } })
              }
            />
          </Animated.View>

          <Animated.View entering={fromRight(980)}>
            <SoftButton
              title={copy.welcome.signIn}
              variant="secondary"
              onPress={() =>
                router.push({ pathname: "/auth", params: { mode: "login" } })
              }
            />
          </Animated.View>

          <Animated.View entering={fromLeft(1110)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={copy.auth.forgot}
              hitSlop={10}
              style={styles.forgotButton}
              onPress={() =>
                router.push({ pathname: "/auth", params: { mode: "forgot" } })
              }
            >
              <AppText style={styles.forgotText}>{copy.auth.forgot}</AppText>
            </Pressable>
          </Animated.View>

          <Animated.View entering={fromRight(1240)} style={styles.languageWrap}>
            <LanguageSelector />
          </Animated.View>

          <Animated.View
            entering={
              reducedMotion
                ? FadeIn.delay(1300).duration(220)
                : FadeInUp.delay(1370).duration(700)
            }
          >
            <AppText style={styles.privacy}>{copy.welcome.privacy}</AppText>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8EF",
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
  },
  peachWash: {
    position: "absolute",
    top: -145,
    left: -120,
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "#FAD7C3",
    opacity: 0.34,
  },
  blueWash: {
    position: "absolute",
    bottom: -180,
    right: -115,
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "#D8EEF4",
    opacity: 0.4,
  },
  brandBlock: {
    height: 313,
  },
  brandInner: {
    alignItems: "center",
  },
  markViewport: {
    width: 214,
    height: 202,
    overflow: "hidden",
  },
  markScale: {
    position: "absolute",
    left: 5,
    top: 0,
    width: 330,
    height: 320,
    transform: [{ scale: 0.62 }],
    transformOrigin: "top left",
  },
  wordmark: {
    width: 214,
    height: 75,
    marginTop: -8,
  },
  brandTagline: {
    width: 220,
    height: 73,
    marginTop: -29,
  },
  textBlock: {
    marginTop: 4,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    maxWidth: 310,
    textAlign: "center",
    fontSize: 28,
    lineHeight: 35,
    fontFamily: "serif",
    color: "#6F5548",
  },
  description: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: "#A67868",
  },
  actions: {
    marginTop: 20,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    gap: 12,
  },
  forgotButton: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  forgotText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#916B5E",
    textDecorationLine: "underline",
  },
  languageWrap: {
    alignItems: "center",
  },
  privacy: {
    alignSelf: "center",
    maxWidth: 310,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#A58C80",
  },
});
