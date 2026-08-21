import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, Share, StyleSheet, Switch, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { updateLocalReminder } from "@/shared/notifications/localReminder";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { useApp } from "@/shared/state/AppProvider";
import { shiftReminderTime } from "@/shared/utils/wellbeing";

const reminderTimes = [8, 13, 20];

export function SettingsScreen() {
  const router = useRouter();
  const { user } = useRequireUser();
  const app = useApp();
  const { copy, reminder, setReminder, clearWellbeingData } = app;
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const applyReminder = async (
    enabled: boolean,
    hour = reminder.hour,
    minute = reminder.minute,
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setMessage("");
    try {
      const result = await updateLocalReminder(
        reminder,
        { enabled, hour, minute },
        { title: copy.common.brand, body: copy.settings.reminderMessage },
      );

      if (result.status === "scheduled") {
        setReminder({ enabled: true, hour, minute, notificationId: result.notificationId });
        setMessage(`${copy.settings.reminderOn} ${formatTime(hour, minute)}`);
      } else if (result.status === "disabled") {
        setReminder({ enabled: false, hour, minute });
        setMessage(copy.settings.reminderOff);
      } else if (result.status === "web") {
        setReminder({ enabled: false, hour, minute });
        setMessage(copy.settings.webNotice);
      } else {
        setReminder({ ...reminder, enabled: false, notificationId: undefined });
        setMessage(copy.settings.notificationDenied);
      }
    } catch {
      setMessage(copy.settings.notificationDenied);
    } finally {
      setIsUpdating(false);
    }
  };

  const exportData = async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      language: app.language,
      profile: app.user,
      mood: app.mood,
      moodHistory: app.moodHistory,
      journalEntries: app.journalEntries,
      breathingSessions: app.breathingSessions,
      favoriteArticleIds: app.favoriteArticleIds,
      reminder: { enabled: app.reminder.enabled, hour: app.reminder.hour, minute: app.reminder.minute },
      supportRegion: app.supportRegion,
    };
    await Share.share({ title: "Plekai data", message: JSON.stringify(payload, null, 2) });
  };

  const adjustReminder = (deltaMinutes: number) => {
    const next = shiftReminderTime(reminder.hour, reminder.minute, deltaMinutes);
    applyReminder(reminder.enabled, next.hour, next.minute);
  };

  const confirmClear = () => {
    Alert.alert(copy.settings.clearTitle, copy.settings.clearMessage, [
      { text: copy.common.cancel, style: "cancel" },
      {
        text: copy.settings.clearData,
        style: "destructive",
        onPress: () => {
          clearWellbeingData();
          setMessage(copy.settings.cleared);
        },
      },
    ]);
  };

  return (
    <AppScaffold active="home" title={copy.settings.title} subtitle={copy.settings.subtitle}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <AppText style={styles.cardTitle}>{copy.settings.reminderTitle}</AppText>
            <AppText style={styles.cardText}>{copy.settings.reminderText}</AppText>
          </View>
          <Switch
            accessibilityLabel={copy.settings.reminderTitle}
            disabled={isUpdating}
            value={reminder.enabled}
            trackColor={{ false: "#D9CCC4", true: "#D5E3D1" }}
            thumbColor={reminder.enabled ? "#71806B" : "#F8F2ED"}
            onValueChange={(enabled) => applyReminder(enabled)}
          />
        </View>

        <View style={styles.times}>
          {reminderTimes.map((hour) => {
            const selected = reminder.hour === hour;
            return (
              <Pressable
                key={hour}
                disabled={isUpdating}
                style={[styles.timeButton, selected && styles.timeButtonActive]}
                onPress={() => applyReminder(reminder.enabled, hour, 0)}
              >
                <AppText style={[styles.timeText, selected && styles.timeTextActive]}>
                  {formatTime(hour, 0)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.preciseTime}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.settings.adjustEarlier}
            disabled={isUpdating}
            style={styles.adjustButton}
            onPress={() => adjustReminder(-30)}
          >
            <AppText style={styles.adjustText}>−30</AppText>
          </Pressable>
          <AppText accessibilityLiveRegion="polite" style={styles.preciseValue}>
            {formatTime(reminder.hour, reminder.minute)}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.settings.adjustLater}
            disabled={isUpdating}
            style={styles.adjustButton}
            onPress={() => adjustReminder(30)}
          >
            <AppText style={styles.adjustText}>+30</AppText>
          </Pressable>
        </View>
        <AppText accessibilityLiveRegion="polite" style={styles.status}>
          {message || (reminder.enabled
            ? `${copy.settings.reminderOn} ${formatTime(reminder.hour, reminder.minute)}`
            : copy.settings.reminderOff)}
        </AppText>
        {Platform.OS === "web" && message !== copy.settings.webNotice ? (
          <AppText style={styles.webNotice}>{copy.settings.webNotice}</AppText>
        ) : null}
      </View>

      <View style={styles.card}>
        <AppText style={styles.cardTitle}>{copy.settings.privacyTitle}</AppText>
        <AppText style={styles.cardText}>{copy.settings.privacyText}</AppText>
        <View style={styles.dataActions}>
          <SoftButton
            title={copy.settings.openPrivacy}
            variant="secondary"
            onPress={() => router.push("/privacy" as Href)}
          />
          <SoftButton title={copy.settings.exportData} variant="secondary" onPress={exportData} />
          <SoftButton title={copy.settings.clearData} variant="secondary" onPress={confirmClear} />
        </View>
      </View>
    </AppScaffold>
  );
}

function formatTime(hour: number, minute: number) {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  card: { marginBottom: 14, padding: 18, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.82)", borderWidth: 1, borderColor: "rgba(173,131,116,0.14)" },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  rowText: { flex: 1 },
  cardTitle: { fontFamily: "serif", fontSize: 20, fontWeight: "700", color: "#705448" },
  cardText: { marginTop: 6, fontSize: 13, lineHeight: 19, color: "#927A6F" },
  times: { marginTop: 17, flexDirection: "row", gap: 8 },
  timeButton: { flex: 1, paddingVertical: 10, borderRadius: 15, alignItems: "center", backgroundColor: "#F3E8E1" },
  timeButtonActive: { backgroundColor: "#816154" },
  timeText: { fontSize: 13, fontWeight: "700", color: "#8D7165" },
  timeTextActive: { color: "#FFFFFF" },
  preciseTime: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14 },
  adjustButton: { minWidth: 62, minHeight: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#E8EDE2" },
  adjustText: { fontSize: 14, fontWeight: "800", color: "#6F7D6B" },
  preciseValue: { minWidth: 60, textAlign: "center", fontFamily: "serif", fontSize: 19, fontWeight: "700", color: "#75594D" },
  status: { marginTop: 13, fontSize: 12, fontWeight: "700", color: "#708071" },
  webNotice: { marginTop: 7, fontSize: 11, lineHeight: 16, color: "#A0877C" },
  dataActions: { marginTop: 17, gap: 9 },
});
