import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import PlekeiLogo from "@/assets/logo/plekei.svg";
import { AppText } from "@/components/ui";
import { GrowingPlekaiMark } from "@/features/splash/GrowingPlekaiMark";

const GROWTH_DURATION_MS = 2600;

type SplashScreenProps = {
  isAppReady: boolean;
  onFinish: () => void;
};

export function SplashScreen({ isAppReady, onFinish }: SplashScreenProps) {
  const reducedMotion = useReducedMotion();
  const [isGrowthComplete, setIsGrowthComplete] = useState(reducedMotion);
  const hasStartedExit = useRef(false);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      setIsGrowthComplete(true);
      return;
    }

    const timer = setTimeout(() => setIsGrowthComplete(true), GROWTH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (!isAppReady || !isGrowthComplete || hasStartedExit.current) return;

    hasStartedExit.current = true;
    screenOpacity.value = withTiming(
      0,
      {
        duration: reducedMotion ? 260 : 520,
        easing: Easing.inOut(Easing.ease),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        if (finished) runOnJS(onFinish)();
      },
    );
  }, [isAppReady, isGrowthComplete, onFinish, reducedMotion, screenOpacity]);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View
      accessibilityLabel="Plekai. Cherish and Breathe."
      accessibilityRole="image"
      style={[styles.screen, screenStyle]}
    >
      <View style={styles.background}>
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="splash-background" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFF9EF" />
              <Stop offset="0.52" stopColor="#F8EBDD" />
              <Stop offset="1" stopColor="#F3DDD8" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#splash-background)" />
        </Svg>
      </View>

      <View style={styles.content}>
        <GrowingPlekaiMark reducedMotion={reducedMotion} />

        <View style={styles.wordmark}>
          <PlekeiLogo width={194} height={78} />
        </View>
        <AppText style={styles.tagline}>Cherish and Breathe</AppText>
        <View style={styles.goldAccent} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  wordmark: {
    height: 58,
    marginTop: -4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tagline: {
    marginTop: 8,
    color: "#9A756B",
    fontSize: 15,
    letterSpacing: 3.4,
    lineHeight: 22,
    textAlign: "center",
  },
  goldAccent: {
    width: 44,
    height: 1,
    marginTop: 18,
    backgroundColor: "#C9A86A",
    opacity: 0.7,
  },
});
