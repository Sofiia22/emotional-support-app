import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";

const SESSION_SECONDS = 60;

export function BreatheScreen() {
  const { user } = useRequireUser();
  const { copy, completeBreathingSession } = useApp();
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const elapsed = SESSION_SECONDS - secondsLeft;
  const phaseIndex = Math.floor((elapsed % 12) / 4);
  const phase = useMemo(
    () => [copy.breathe.inhale, copy.breathe.hold, copy.breathe.exhale][phaseIndex],
    [copy.breathe.exhale, copy.breathe.hold, copy.breathe.inhale, phaseIndex],
  );

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setIsRunning(false);
        setIsComplete(true);
        completeBreathingSession();
        return;
      }

      setSecondsLeft(secondsLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [completeBreathingSession, isRunning, secondsLeft]);

  if (!user) return null;

  const reset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setSecondsLeft(SESSION_SECONDS);
  };

  const startOrResume = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(SESSION_SECONDS);
      setIsComplete(false);
    }
    setIsRunning(true);
  };

  return (
    <AppScaffold
      active="breathe"
      title={copy.breathe.title}
      subtitle={copy.breathe.subtitle}
    >
      <View style={styles.exerciseCard}>
        <AppText style={styles.exerciseTitle}>{copy.breathe.exercise}</AppText>
        <AppText style={styles.instruction}>{copy.breathe.instruction}</AppText>

        <View style={styles.orbitOuter}>
          <View
            style={[
              styles.breathCircle,
              phaseIndex === 0 && styles.inhaleCircle,
              phaseIndex === 1 && styles.holdCircle,
              phaseIndex === 2 && styles.exhaleCircle,
            ]}
          >
            <AppText style={styles.phaseText}>
              {isRunning ? phase : isComplete ? "✓" : "◌"}
            </AppText>
            <AppText style={styles.timerText}>{secondsLeft}</AppText>
            <AppText style={styles.secondsLabel}>{copy.breathe.seconds}</AppText>
          </View>
        </View>

        <AppText accessibilityLiveRegion="polite" style={styles.statusText}>
          {isComplete
            ? copy.breathe.complete
            : isRunning
              ? phase
              : copy.breathe.ready}
        </AppText>

        {isRunning ? (
          <SoftButton
            title={copy.breathe.pause}
            variant="secondary"
            onPress={() => setIsRunning(false)}
          />
        ) : (
          <SoftButton
            title={
              secondsLeft < SESSION_SECONDS && !isComplete
                ? copy.breathe.resume
                : copy.breathe.start
            }
            onPress={startOrResume}
          />
        )}

        {secondsLeft < SESSION_SECONDS ? (
          <Pressable
            accessibilityRole="button"
            style={styles.resetButton}
            onPress={reset}
          >
            <AppText style={styles.resetText}>{copy.breathe.reset}</AppText>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.groundingCard}>
        <View style={styles.groundingIcon}>
          <AppText style={styles.groundingGlyph}>5</AppText>
        </View>
        <View style={styles.groundingContent}>
          <AppText style={styles.groundingTitle}>
            {copy.breathe.groundingTitle}
          </AppText>
          <AppText style={styles.groundingText}>
            {copy.breathe.groundingText}
          </AppText>
        </View>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    padding: 22,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(144,180,186,0.22)",
  },
  exerciseTitle: {
    fontFamily: "serif",
    fontSize: 23,
    fontWeight: "700",
    color: "#5F7774",
  },
  instruction: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#81938F",
  },
  orbitOuter: {
    width: 230,
    height: 230,
    marginVertical: 22,
    borderRadius: 115,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(216,238,244,0.34)",
    borderWidth: 1,
    borderColor: "rgba(121,161,167,0.2)",
  },
  breathCircle: {
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9EDF1",
    shadowColor: "#6F9EA5",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  inhaleCircle: {
    transform: [{ scale: 1.08 }],
    backgroundColor: "#D2EAEF",
  },
  holdCircle: {
    backgroundColor: "#E4E0EF",
  },
  exhaleCircle: {
    transform: [{ scale: 0.94 }],
    backgroundColor: "#F1E3D5",
  },
  phaseText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#5D7775",
  },
  timerText: {
    marginTop: 3,
    fontFamily: "serif",
    fontSize: 43,
    lineHeight: 50,
    fontWeight: "700",
    color: "#526D6A",
  },
  secondsLabel: {
    fontSize: 10,
    color: "#7F9591",
  },
  statusText: {
    minHeight: 24,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#667D78",
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingTop: 13,
  },
  resetText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8C7469",
  },
  groundingCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 24,
    flexDirection: "row",
    backgroundColor: "rgba(245, 231, 200, 0.58)",
  },
  groundingIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1D9A9",
  },
  groundingGlyph: {
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "700",
    color: "#836D4B",
  },
  groundingContent: {
    flex: 1,
    paddingLeft: 14,
  },
  groundingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#79684D",
  },
  groundingText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#91816A",
  },
});
