import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import PlekeiLogo from "@/assets/logo/plekei.svg";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { AppText, SoftButton } from "@/components/ui";
import { useApp } from "@/shared/state/AppProvider";

const featherImage = require("../../assets/images/feather.png");

export function WelcomeScreen() {
  const router = useRouter();
  const { copy } = useApp();
  const feather = useSharedValue(0);

  useEffect(() => {
    feather.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [feather]);

  const featherStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(feather.value, [0, 1], [0, -8]) },
      { rotate: `${interpolate(feather.value, [0, 1], [-2, 2])}deg` },
    ],
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.peachWash} />
      <View style={styles.blueWash} />

      <Animated.View entering={FadeIn.duration(1400)} style={styles.logoBlock}>
        <PlekeiLogo width={250} height={105} />

        <AppText style={styles.tagline}>{copy.common.tagline}</AppText>
      </Animated.View>

      <Animated.Image
        source={featherImage}
        resizeMode="contain"
        entering={FadeIn.delay(500).duration(1400)}
        style={[styles.feather, featherStyle]}
      />

      <Animated.View
        entering={FadeIn.delay(800).duration(1400)}
        style={styles.textBlock}
      >
        <AppText style={styles.title}>{copy.welcome.title}</AppText>

        <AppText style={styles.description}>
          {copy.welcome.description}
        </AppText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(1000).duration(900)}
        style={styles.actions}
      >
        <SoftButton
          title={copy.welcome.getStarted}
          onPress={() =>
            router.push({ pathname: "/auth", params: { mode: "register" } })
          }
        />
        <SoftButton
          title={copy.welcome.signIn}
          variant="secondary"
          onPress={() =>
            router.push({ pathname: "/auth", params: { mode: "login" } })
          }
        />
        <LanguageSelector />
        <AppText style={styles.privacy}>{copy.welcome.privacy}</AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8EF",
    paddingHorizontal: 28,
    paddingTop: 62,
    paddingBottom: 26,
    overflow: "hidden",
  },
  peachWash: {
    position: "absolute",
    top: -145,
    left: -120,
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "#FAD7C3",
    opacity: 0.42,
  },
  blueWash: {
    position: "absolute",
    bottom: -180,
    right: -115,
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "#D8EEF4",
    opacity: 0.48,
  },
  logoBlock: {
    alignItems: "center",
  },
  tagline: {
    marginTop: -18,
    fontSize: 15,
    letterSpacing: 4,
    color: "#B9958B",
  },
  feather: {
    alignSelf: "center",
    width: 230,
    height: 130,
    marginTop: 34,
  },
  textBlock: {
    marginTop: 24,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    maxWidth: 310,
    textAlign: "center",
    fontSize: 30,
    lineHeight: 38,
    fontFamily: "serif",
    color: "#6F5548",
  },
  description: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: "#A67868",
  },
  actions: {
    marginTop: 28,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    gap: 14,
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
