import { Platform } from "react-native";

import { DailyReminder } from "@/shared/state/AppProvider";

type ReminderCopy = {
  title: string;
  body: string;
};

export type ReminderResult =
  | { status: "scheduled"; notificationId: string }
  | { status: "disabled" }
  | { status: "denied" }
  | { status: "web" };

export async function updateLocalReminder(
  current: DailyReminder,
  next: Omit<DailyReminder, "notificationId">,
  copy: ReminderCopy,
): Promise<ReminderResult> {
  if (Platform.OS === "web") return { status: "web" };

  const Notifications = await import("expo-notifications");

  if (current.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(
      current.notificationId,
    ).catch(() => undefined);
  }

  if (!next.enabled) return { status: "disabled" };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("plekai-reminders", {
      name: "Plekai reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  let permission = await Notifications.getPermissionsAsync();
  if (permission.status !== Notifications.PermissionStatus.GRANTED) {
    permission = await Notifications.requestPermissionsAsync();
  }
  if (permission.status !== Notifications.PermissionStatus.GRANTED) {
    return { status: "denied" };
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: copy.title,
      body: copy.body,
      data: { path: "/home" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: next.hour,
      minute: next.minute,
      channelId: Platform.OS === "android" ? "plekai-reminders" : undefined,
    },
  });

  return { status: "scheduled", notificationId };
}
