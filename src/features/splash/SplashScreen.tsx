import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { GrowingPlekaiMark } from "@/features/splash/GrowingPlekaiMark";

const taglineImage = require("../../assets/logo/animated/tagline.png");
const wordmarkBaseImage = require("../../assets/logo/animated/wordmark-base.png");
const wordmarkLeafImage = require("../../assets/logo/animated/wordmark-i-leaf.png");

const WORDMARK_LEAF_DELAY_MS = 8800;
const WORDMARK_LEAF_DURATION_MS = 1000;
const SPLASH_TOTAL_DURATION_MS = 12800;

type SplashScreenProps = {
  isAppReady: boolean;
  onFinish: () => void;
};

export function SplashScreen({ isAppReady, onFinish }: SplashScreenProps) {
  const reducedMotion = useReducedMotion();
  const [isGrowthComplete, setIsGrowthComplete] = useState(reducedMotion);
  const hasStartedExit = useRef(false);
  const screenOpacity = useSharedValue(1);
  const wordmarkLeaf = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      setIsGrowthComplete(true);
      return;
    }

    const timer = setTimeout(
      () => setIsGrowthComplete(true),
      SPLASH_TOTAL_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      wordmarkLeaf.value = 1;
      return;
    }

    wordmarkLeaf.value = withDelay(
      WORDMARK_LEAF_DELAY_MS,
      withTiming(1, {
        duration: WORDMARK_LEAF_DURATION_MS,
        easing: Easing.bezier(0.2, 0.72, 0.26, 1),
      }),
    );
  }, [reducedMotion, wordmarkLeaf]);

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
  const wordmarkLeafStyle = useAnimatedStyle(() => ({
    opacity: wordmarkLeaf.value,
    transform: [
      { scale: 0.58 + wordmarkLeaf.value * 0.42 },
      { rotate: `${-12 + wordmarkLeaf.value * 12}deg` },
    ],
  }));

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
          <Animated.Image
            source={wordmarkBaseImage}
            resizeMode="contain"
            style={styles.wordmarkBase}
          />
          <Animated.Image
            source={wordmarkLeafImage}
            resizeMode="contain"
            style={[styles.wordmarkLeaf, wordmarkLeafStyle]}
          />
        </View>
        <Animated.Image
          source={taglineImage}
          resizeMode="contain"
          style={styles.tagline}
        />
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
    paddingBottom: 22,
  },
  wordmark: {
    width: 252,
    height: 89,
    marginTop: -19,
  },
  wordmarkBase: {
    ...StyleSheet.absoluteFillObject,
    width: 252,
    height: 89,
  },
  wordmarkLeaf: {
    position: "absolute",
    left: 220,
    top: 14,
    width: 27,
    height: 22,
    transformOrigin: "8% 100%",
  },
  tagline: {
    width: 260,
    height: 87,
    marginTop: -25,
  },
});
