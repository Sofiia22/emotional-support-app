import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const MARK_SIZE = 250;

type GrowingPlekaiMarkProps = {
  reducedMotion: boolean;
};

type LeafProps = {
  direction: "left" | "right";
};

function useLeafStyle(progress: SharedValue<number>, rotation: number) {
  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: 0.12 + progress.value * 0.88 },
      { rotate: `${rotation * (1 - progress.value)}deg` },
    ],
  }));
}

function Leaf({ direction }: LeafProps) {
  const isLeft = direction === "left";

  return (
    <Svg width="100%" height="100%" viewBox="0 0 58 36">
      <Defs>
        <LinearGradient id={`leaf-${direction}`} x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#667252" />
          <Stop offset="0.58" stopColor="#87916B" />
          <Stop offset="1" stopColor="#A7AD87" />
        </LinearGradient>
      </Defs>
      <Path
        d={
          isLeft
            ? "M55 31 C41 35 18 32 4 12 C22 4 44 9 55 31 Z"
            : "M3 31 C17 35 40 32 54 12 C36 4 14 9 3 31 Z"
        }
        fill={`url(#leaf-${direction})`}
        stroke="#5E674D"
        strokeWidth="1.2"
      />
      <Path
        d={isLeft ? "M53 29 C36 22 22 17 8 13" : "M5 29 C22 22 36 17 50 13"}
        fill="none"
        stroke="#D7D4AF"
        strokeLinecap="round"
        strokeWidth="1"
        opacity="0.74"
      />
    </Svg>
  );
}

export function GrowingPlekaiMark({ reducedMotion }: GrowingPlekaiMarkProps) {
  const stemGrowth = useSharedValue(reducedMotion ? 1 : 0);
  const leafOne = useSharedValue(reducedMotion ? 1 : 0);
  const leafTwo = useSharedValue(reducedMotion ? 1 : 0);
  const leafThree = useSharedValue(reducedMotion ? 1 : 0);
  const leafFour = useSharedValue(reducedMotion ? 1 : 0);
  const canopyIdle = useSharedValue(0);
  const glow = useSharedValue(reducedMotion ? 0.42 : 0.18);

  useEffect(() => {
    if (reducedMotion) {
      stemGrowth.value = 1;
      leafOne.value = 1;
      leafTwo.value = 1;
      leafThree.value = 1;
      leafFour.value = 1;
      glow.value = 0.42;
      return;
    }

    const organicEase = Easing.bezier(0.22, 0.72, 0.28, 1);

    stemGrowth.value = withDelay(
      300,
      withTiming(1, { duration: 1200, easing: organicEase }),
    );
    leafOne.value = withDelay(
      1000,
      withTiming(1, { duration: 500, easing: organicEase }),
    );
    leafTwo.value = withDelay(
      1300,
      withTiming(1, { duration: 500, easing: organicEase }),
    );
    leafThree.value = withDelay(
      1600,
      withTiming(1, { duration: 520, easing: organicEase }),
    );
    leafFour.value = withDelay(
      1850,
      withTiming(1, { duration: 500, easing: organicEase }),
    );
    glow.value = withDelay(
      1100,
      withTiming(0.54, { duration: 1200, easing: Easing.out(Easing.ease) }),
    );
    canopyIdle.value = withDelay(
      2600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 1900, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [
    canopyIdle,
    glow,
    leafFour,
    leafOne,
    leafThree,
    leafTwo,
    reducedMotion,
    stemGrowth,
  ]);

  const stemRevealStyle = useAnimatedStyle(() => ({
    height: 150 * stemGrowth.value,
    opacity: stemGrowth.value,
  }));
  const leafOneStyle = useLeafStyle(leafOne, -16);
  const leafTwoStyle = useLeafStyle(leafTwo, 14);
  const leafThreeStyle = useLeafStyle(leafThree, -12);
  const leafFourStyle = useLeafStyle(leafFour, 10);
  const canopyIdleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${canopyIdle.value * 0.7}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.mark}>
      <Animated.View style={[styles.glow, glowStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 250 250">
          <Defs>
            <RadialGradient id="growth-glow" cx="50%" cy="57%" r="48%">
              <Stop offset="0" stopColor="#E8C98C" stopOpacity="0.72" />
              <Stop offset="0.52" stopColor="#E8C98C" stopOpacity="0.25" />
              <Stop offset="1" stopColor="#E8C98C" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="125" cy="142" r="105" fill="url(#growth-glow)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.canopy, canopyIdleStyle]}>
        <View style={styles.stemWindow}>
          <Animated.View style={[styles.stemReveal, stemRevealStyle]}>
            <Svg width="100%" height="150" viewBox="0 0 250 150" style={styles.stemSvg}>
              <Path
                d="M126 147 C126 123 119 109 123 91 C127 72 141 60 138 39 C136 27 131 19 128 9"
                fill="none"
                stroke="#5F694E"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <Path
                d="M126 145 C127 120 122 106 126 89 C130 69 142 57 138 39"
                fill="none"
                stroke="#9DA27C"
                strokeLinecap="round"
                strokeWidth="1.4"
                opacity="0.8"
              />
            </Svg>
          </Animated.View>
        </View>

        <Animated.View style={[styles.leafOne, leafOneStyle]}>
          <Leaf direction="left" />
        </Animated.View>
        <Animated.View style={[styles.leafTwo, leafTwoStyle]}>
          <Leaf direction="right" />
        </Animated.View>
        <Animated.View style={[styles.leafThree, leafThreeStyle]}>
          <Leaf direction="left" />
        </Animated.View>
        <Animated.View style={[styles.leafFour, leafFourStyle]}>
          <Leaf direction="right" />
        </Animated.View>
      </Animated.View>

      <View style={styles.stone}>
        <Svg width="100%" height="100%" viewBox="0 0 250 100">
          <Defs>
            <LinearGradient id="stone-left" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#B9A89B" />
              <Stop offset="0.55" stopColor="#8E7B70" />
              <Stop offset="1" stopColor="#6E5A51" />
            </LinearGradient>
            <LinearGradient id="stone-right" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#C8B8AA" />
              <Stop offset="0.58" stopColor="#9A877B" />
              <Stop offset="1" stopColor="#756159" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="125" cy="90" rx="75" ry="7" fill="#705B52" opacity="0.14" />
          <Path
            d="M125 91 L113 78 L116 63 L103 48 L109 34 L96 18 C73 18 51 34 46 56 C43 76 61 91 91 94 Z"
            fill="url(#stone-left)"
            stroke="#67534B"
            strokeWidth="1.6"
          />
          <Path
            d="M125 91 L136 76 L132 61 L145 47 L139 31 L151 18 C179 19 203 36 205 59 C206 78 187 91 158 94 Z"
            fill="url(#stone-right)"
            stroke="#67534B"
            strokeWidth="1.6"
          />
          <Path
            d="M125 91 L113 78 L117 64 L105 49 L111 34 L99 19"
            fill="none"
            stroke="#F7E9D8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.2"
          />
          <Path
            d="M126 91 L136 76 L132 61 L145 47 L139 31 L150 18"
            fill="none"
            stroke="#4F403A"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.1"
            opacity="0.86"
          />
          <Path
            d="M67 51 C77 37 91 31 103 32 M160 31 C176 34 187 43 193 56"
            fill="none"
            stroke="#D8C9BC"
            strokeLinecap="round"
            strokeWidth="2"
            opacity="0.4"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { width: MARK_SIZE, height: MARK_SIZE },
  glow: { ...StyleSheet.absoluteFillObject },
  canopy: { ...StyleSheet.absoluteFillObject },
  stemWindow: {
    position: "absolute",
    left: 0,
    bottom: 58,
    width: MARK_SIZE,
    height: 150,
    overflow: "hidden",
  },
  stemReveal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  stemSvg: { position: "absolute", left: 0, bottom: 0 },
  leafOne: { position: "absolute", left: 70, top: 80, width: 58, height: 36 },
  leafTwo: { position: "absolute", left: 136, top: 57, width: 58, height: 36 },
  leafThree: { position: "absolute", left: 79, top: 37, width: 55, height: 34 },
  leafFour: { position: "absolute", left: 126, top: 12, width: 51, height: 32 },
  stone: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
});
