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
const topLeafImage = require("../../assets/logo/animated/top-leaf.png");
const goldArcsImage = require("../../assets/logo/animated/gold-arcs.png");
const butterflyImage = require("../../assets/logo/animated/butterfly.png");

const PLANT_HEIGHT = 216;
const ARCS_WIDTH = 310;

type GrowingPlekaiMarkProps = {
  reducedMotion: boolean;
};

export function GrowingPlekaiMark({ reducedMotion }: GrowingPlekaiMarkProps) {
  const growth = useSharedValue(reducedMotion ? 1 : 0);
  const topLeaf = useSharedValue(reducedMotion ? 1 : 0);
  const arcs = useSharedValue(reducedMotion ? 1 : 0);
  const butterfly = useSharedValue(reducedMotion ? 1 : 0);
  const idle = useSharedValue(0);
  const butterflyIdle = useSharedValue(0);
  const glow = useSharedValue(reducedMotion ? 0.42 : 0.16);

  useEffect(() => {
    if (reducedMotion) {
      growth.value = 1;
      topLeaf.value = 1;
      arcs.value = 1;
      butterfly.value = 1;
      glow.value = 0.42;
      return;
    }

    growth.value = withDelay(
      500,
      withTiming(1, {
        duration: 5000,
        easing: Easing.bezier(0.2, 0.72, 0.26, 1),
      }),
    );
    topLeaf.value = withDelay(
      4700,
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.2, 0.72, 0.26, 1),
      }),
    );
    arcs.value = withDelay(
      6000,
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
    );
    butterfly.value = withDelay(
      8000,
      withTiming(1, {
        duration: 1400,
        easing: Easing.bezier(0.2, 0.72, 0.26, 1),
      }),
    );
    glow.value = withDelay(
      2000,
      withTiming(0.52, { duration: 4500, easing: Easing.out(Easing.ease) }),
    );
    idle.value = withDelay(
      10100,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
    butterflyIdle.value = withDelay(
      10100,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [arcs, butterfly, butterflyIdle, glow, growth, idle, reducedMotion, topLeaf]);

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
  const topLeafStyle = useAnimatedStyle(() => ({
    opacity: topLeaf.value,
    transform: [
      { scale: 0.58 + topLeaf.value * 0.42 },
      { rotate: `${-12 + topLeaf.value * 12}deg` },
    ],
  }));
  const arcsRevealStyle = useAnimatedStyle(() => ({
    width: ARCS_WIDTH * arcs.value,
    opacity: arcs.value,
  }));
  const butterflyStyle = useAnimatedStyle(() => ({
    opacity: butterfly.value,
    transform: [
      { translateY: -butterfly.value * 3 + butterflyIdle.value * 0.7 },
      { scale: 0.72 + butterfly.value * 0.28 },
      { rotate: `${-7 + butterfly.value * 7 + butterflyIdle.value * 0.45}deg` },
    ],
  }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.mark}
    >
      <Animated.View style={[styles.glow, glowStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 330 320">
          <Defs>
            <RadialGradient id="original-logo-glow" cx="50%" cy="58%" r="46%">
              <Stop offset="0" stopColor="#E4BE76" stopOpacity="0.62" />
              <Stop offset="0.5" stopColor="#E4BE76" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#E4BE76" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="165" cy="178" r="132" fill="url(#original-logo-glow)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.arcsReveal, arcsRevealStyle]}>
        <Image source={goldArcsImage} resizeMode="stretch" style={styles.arcs} />
      </Animated.View>

      <Animated.View style={[styles.plantLayer, idleStyle]}>
        <Animated.View style={[styles.plantReveal, revealStyle]}>
          <Image source={plantImage} resizeMode="contain" style={styles.plant} />
        </Animated.View>
      </Animated.View>

      <Animated.Image
        source={topLeafImage}
        resizeMode="contain"
        style={[styles.topLeaf, topLeafStyle]}
      />

      <Image
        source={stoneHeartImage}
        resizeMode="contain"
        style={styles.stoneHeart}
      />

      <Animated.Image
        source={butterflyImage}
        resizeMode="contain"
        style={[styles.butterfly, butterflyStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 330,
    height: 320,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  plantLayer: {
    position: "absolute",
    left: 80,
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
    left: 57,
    bottom: 2,
    width: 216,
    height: 153,
  },
  topLeaf: {
    position: "absolute",
    left: 139,
    top: 20,
    width: 50,
    height: 62,
    transformOrigin: "88% 100%",
  },
  arcsReveal: {
    position: "absolute",
    left: 8,
    top: 24,
    height: 225,
    overflow: "hidden",
  },
  arcs: {
    position: "absolute",
    left: 0,
    top: 0,
    width: ARCS_WIDTH,
    height: 225,
  },
  butterfly: {
    position: "absolute",
    right: 8,
    top: 0,
    width: 92,
    height: 107,
  },
});
