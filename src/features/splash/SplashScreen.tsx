import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import PlekeiLogo from "@/assets/logo/plekei.svg";
import { AppText } from "@/components/ui";

const featherImage = require("../../assets/images/feather.png");

export function SplashScreen() {
  const feather = useSharedValue(0);

  const dotOne = useSharedValue(1);
  const dotTwo = useSharedValue(0.3);
  const dotThree = useSharedValue(0.3);

  feather.value = withRepeat(
    withSequence(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
    ),
    -1,
  );

  dotOne.value = withRepeat(
    withSequence(
      withTiming(1, { duration: 450 }),
      withTiming(0.3, { duration: 450 }),
      withDelay(900, withTiming(0.3, { duration: 1 })),
    ),
    -1,
  );

  dotTwo.value = withRepeat(
    withSequence(
      withTiming(0.3, { duration: 450 }),
      withTiming(1, { duration: 450 }),
      withTiming(0.3, { duration: 450 }),
      withDelay(450, withTiming(0.3, { duration: 1 })),
    ),
    -1,
  );

  dotThree.value = withRepeat(
    withSequence(
      withDelay(900, withTiming(1, { duration: 450 })),
      withTiming(0.3, { duration: 450 }),
    ),
    -1,
  );

  const featherStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(feather.value, [0, 1], [0, -10]) },
      { rotate: `${interpolate(feather.value, [0, 1], [-2, 2])}deg` },
    ],
  }));

  const dotOneStyle = useAnimatedStyle(() => ({ opacity: dotOne.value }));
  const dotTwoStyle = useAnimatedStyle(() => ({ opacity: dotTwo.value }));
  const dotThreeStyle = useAnimatedStyle(() => ({ opacity: dotThree.value }));

  return (
    <View style={styles.screen}>
      <View style={styles.peachBlob} />
      <View style={styles.pinkBlob} />
      <View style={styles.blueBlob} />

      <View style={styles.logoBlock}>
        <Animated.View entering={FadeIn.duration(1600)}>
          <PlekeiLogo width={280} height={120} />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(700).duration(1600)}>
          <AppText style={styles.tagline}>Cherish and Breathe</AppText>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(1000).duration(1400)}
          style={styles.decor}
        >
          <View style={styles.line} />
          <AppText style={styles.branch}>• ✦ •</AppText>
          <View style={styles.line} />
        </Animated.View>
      </View>

      <View style={styles.featherBlock}>
        <Animated.Image
          source={featherImage}
          resizeMode="contain"
          entering={FadeIn.delay(1300).duration(1600)}
          style={[styles.feather, featherStyle]}
        />
      </View>

      <View style={styles.dots}>
        <Animated.View style={[styles.dot, dotOneStyle]} />
        <Animated.View style={[styles.dot, dotTwoStyle]} />
        <Animated.View style={[styles.dot, dotThreeStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8EF",
    overflow: "hidden",
  },
  peachBlob: {
    position: "absolute",
    top: -90,
    left: -90,
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "#FAD7C3",
    opacity: 0.48,
  },
  pinkBlob: {
    position: "absolute",
    top: 95,
    right: -130,
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: "#F8C9C9",
    opacity: 0.23,
  },
  blueBlob: {
    position: "absolute",
    bottom: -115,
    right: -90,
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "#CFEAF3",
    opacity: 0.55,
  },
  logoBlock: {
    position: "absolute",
    top: "28%",
    width: "100%",
    alignItems: "center",
  },
  tagline: {
    marginTop: -6,
    fontSize: 17,
    letterSpacing: 5,
    color: "#BE8F82",
  },
  decor: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  line: {
    width: 54,
    height: 1,
    backgroundColor: "#D7B2A6",
  },
  branch: {
    fontSize: 14,
    color: "#C9A096",
  },
  featherBlock: {
    position: "absolute",
    bottom: 185,
    width: "100%",
    alignItems: "center",
  },
  feather: {
    width: 350,
    height: 200,
  },
  dots: {
    position: "absolute",
    bottom: 105,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A67868",
  },
});
