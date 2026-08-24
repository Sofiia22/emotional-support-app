import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const plantImage = require("../../assets/logo/animated/plant.png");
const stoneHeartImage = require("../../assets/logo/animated/stone-heart.png");

const PLANT_HEIGHT = 216;

type GrowingPlekaiMarkProps = {
  reducedMotion: boolean;
};

export function GrowingPlekaiMark({ reducedMotion }: GrowingPlekaiMarkProps) {
  const growth = useSharedValue(reducedMotion ? 1 : 0);
  const idle = useSharedValue(0);
  const glow = useSharedValue(reducedMotion ? 0.42 : 0.16);

  useEffect(() => {
    if (reducedMotion) {
      growth.value = 1;
      glow.value = 0.42;
      return;
    }

    growth.value = withDelay(
      280,
      withTiming(1, {
        duration: 1950,
        easing: Easing.bezier(0.2, 0.72, 0.26, 1),
      }),
    );
    glow.value = withDelay(
      900,
      withTiming(0.52, { duration: 1250, easing: Easing.out(Easing.ease) }),
    );
    idle.value = withDelay(
      2600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [glow, growth, idle, reducedMotion]);

  const revealStyle = useAnimatedStyle(() => ({
    height: PLANT_HEIGHT * growth.value,
    opacity: growth.value,
  }));
  const idleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: idle.value * 0.6 },
      { rotate: `${idle.value * 0.55}deg` },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.mark}
    >
      <Animated.View style={[styles.glow, glowStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 280 300">
          <Defs>
            <RadialGradient id="original-logo-glow" cx="50%" cy="58%" r="46%">
              <Stop offset="0" stopColor="#E4BE76" stopOpacity="0.62" />
              <Stop offset="0.5" stopColor="#E4BE76" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#E4BE76" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="140" cy="170" r="126" fill="url(#original-logo-glow)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.plantLayer, idleStyle]}>
        <Animated.View style={[styles.plantReveal, revealStyle]}>
          <Image source={plantImage} resizeMode="contain" style={styles.plant} />
        </Animated.View>
      </Animated.View>

      <Image
        source={stoneHeartImage}
        resizeMode="contain"
        style={styles.stoneHeart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 280,
    height: 300,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  plantLayer: {
    position: "absolute",
    left: 55,
    bottom: 29,
    width: 190,
    height: PLANT_HEIGHT,
  },
  plantReveal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  plant: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 190,
    height: PLANT_HEIGHT,
  },
  stoneHeart: {
    position: "absolute",
    left: 32,
    bottom: 2,
    width: 216,
    height: 153,
  },
});
