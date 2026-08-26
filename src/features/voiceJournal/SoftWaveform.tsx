import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const BAR_LEVELS = [0.35, 0.55, 0.78, 0.46, 0.9, 0.62, 0.38, 0.72, 1, 0.58, 0.82, 0.43, 0.68, 0.92, 0.52, 0.32, 0.6, 0.4];

export function SoftWaveform({ active }: { active: boolean }) {
  const values = useRef(BAR_LEVELS.map(() => new Animated.Value(0.45))).current;

  useEffect(() => {
    if (!active) {
      values.forEach((value, index) => value.setValue(BAR_LEVELS[index] * 0.72));
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.stagger(
          34,
          values.map((value, index) =>
            Animated.timing(value, {
              duration: 520,
              toValue: BAR_LEVELS[index],
              useNativeDriver: true,
            }),
          ),
        ),
        Animated.stagger(
          26,
          [...values].reverse().map((value, index) =>
            Animated.timing(value, {
              duration: 620,
              toValue: 0.28 + BAR_LEVELS[BAR_LEVELS.length - 1 - index] * 0.24,
              useNativeDriver: true,
            }),
          ),
        ),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [active, values]);

  return (
    <View accessibilityElementsHidden style={styles.waveform}>
      {values.map((value, index) => (
        <Animated.View
          key={index}
          style={[styles.bar, { transform: [{ scaleY: value }] }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  waveform: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  bar: {
    width: 3,
    height: 38,
    borderRadius: 2,
    backgroundColor: "#DFA18F",
  },
});
