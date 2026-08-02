import { useEffect } from "react";
import { useReminderStore } from "../store/reminderStore";

export default function useReminders() {
  const { getDueReminders, processRecurringReminders } = useReminderStore();

  useEffect(() => {
    // Check for due reminders every minute
    const interval = setInterval(() => {
      const dueReminders = getDueReminders();
      
      dueReminders.forEach((reminder) => {
        // Show desktop notification
        if (window.focusAPI?.showReminderNotification) {
          window.focusAPI.showReminderNotification(
            reminder.title,
            reminder.description || "Reminder"
          );
        }
      });
      
      // Process recurring reminders
      processRecurringReminders();
    }, 60000); // Check every minute

    // Initial check
    const dueReminders = getDueReminders();
    dueReminders.forEach((reminder) => {
      if (window.focusAPI?.showReminderNotification) {
        window.focusAPI.showReminderNotification(
          reminder.title,
          reminder.description || "Reminder"
        );
      }
    });

    return () => clearInterval(interval);
  }, [getDueReminders, processRecurringReminders]);
}
