import { useEffect } from "react";
import { useReminderStore } from "../store/reminderStore";
import { useSettingsStore } from "../store/settingsStore";
import { isSideSurface } from "../utils/surface";

function notify(title: string, body: string) {
  if (window.focusAPI?.showReminderNotification) {
    window.focusAPI.showReminderNotification(title, body);
    return;
  }

  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

export default function useReminders() {
  const getDueReminders = useReminderStore((state) => state.getDueReminders);
  const processRecurringReminders = useReminderStore((state) => state.processRecurringReminders);
  const markAlerted = useReminderStore((state) => state.markAlerted);
  const desktopNotifications = useSettingsStore((state) => state.desktopNotifications);

  useEffect(() => {
    if (isSideSurface() || !desktopNotifications) return;
    if (!window.focusAPI && typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, [desktopNotifications]);

  useEffect(() => {
    if (isSideSurface()) return undefined;
    const check = () => {
      const dueReminders = getDueReminders();
      dueReminders.forEach((reminder) => {
        if (desktopNotifications) {
          notify(reminder.title, reminder.description || "Reminder");
        }
        markAlerted(reminder.id);
      });
      processRecurringReminders();
    };

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [desktopNotifications, getDueReminders, markAlerted, processRecurringReminders]);
}
