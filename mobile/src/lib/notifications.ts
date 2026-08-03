import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type ReminderNotification = {
  id: number;
  type: string;
  due_date: string;
  message: string;
  sent: boolean;
};

// Schedules a local device notification for each unsent, future reminder.
// Using `notif-<id>` as the identifier makes this idempotent: re-scheduling
// the same reminder just replaces the existing one instead of duplicating it.
export async function scheduleReminders(notifications: ReminderNotification[]) {
  if (Platform.OS === 'web') return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: requested } = await Notifications.requestPermissionsAsync();
    if (requested !== 'granted') return;
  }

  const now = new Date();
  for (const notification of notifications) {
    const dueDate = new Date(notification.due_date);
    if (notification.sent || dueDate <= now) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: `notif-${notification.id}`,
      content: { title: 'Foreign K-Startup', body: notification.message },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: dueDate },
    });
  }
}

export async function cancelReminder(id: number) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(`notif-${id}`);
}
