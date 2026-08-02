import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reminder } from "../types/reminder";

interface ReminderState {
  reminders: Reminder[];
  
  // CRUD operations
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt" | "status">) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  
  // Status operations
  completeReminder: (id: string) => void;
  dismissReminder: (id: string) => void;
  
  // Query operations
  getPendingReminders: () => Reminder[];
  getDueReminders: () => Reminder[];
  getRemindersForDate: (date: string) => Reminder[];
  
  // Recurring reminder operations
  processRecurringReminders: () => void;
  getNextOccurrence: (reminder: Reminder) => string | null;
  
  // Reset
  resetReminders: () => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      
      addReminder: (reminder) => {
        const newReminder: Reminder = {
          ...reminder,
          id: crypto.randomUUID(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
      },
      
      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },
      
      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },
      
      completeReminder: (id) => {
        const reminder = get().reminders.find((r) => r.id === id);
        if (!reminder) return;
        
        const now = new Date().toISOString();
        
        if (reminder.frequency === "once") {
          set((state) => ({
            reminders: state.reminders.map((r) =>
              r.id === id
                ? { ...r, status: "completed", completedAt: now }
                : r
            ),
          }));
        } else {
          // For recurring reminders, create next occurrence
          const nextOccurrence = get().getNextOccurrence(reminder);
          if (nextOccurrence) {
            set((state) => ({
              reminders: state.reminders.map((r) =>
                r.id === id
                  ? {
                      ...r,
                      status: "completed",
                      completedAt: now,
                      dueDate: nextOccurrence,
                    }
                  : r
              ),
            }));
          }
        }
      },
      
      dismissReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, status: "dismissed" } : r
          ),
        }));
      },
      
      getPendingReminders: () => {
        return get().reminders.filter((r) => r.status === "pending");
      },
      
      getDueReminders: () => {
        const now = new Date();
        return get().reminders.filter((r) => {
          if (r.status !== "pending") return false;
          
          const dueDate = new Date(r.dueDate);
          if (r.dueTime) {
            const [hours, minutes] = r.dueTime.split(":").map(Number);
            dueDate.setHours(hours, minutes, 0, 0);
          }
          
          return dueDate <= now;
        });
      },
      
      getRemindersForDate: (date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        return get().reminders.filter((r) => {
          const reminderDate = new Date(r.dueDate);
          reminderDate.setHours(0, 0, 0, 0);
          
          return reminderDate >= targetDate && reminderDate < nextDay;
        });
      },
      
      processRecurringReminders: () => {
        const now = new Date();
        const reminders = get().reminders;
        
        reminders.forEach((reminder) => {
          if (reminder.status !== "pending" || reminder.frequency === "once") return;
          
          const dueDate = new Date(reminder.dueDate);
          if (dueDate < now) {
            // Reminder is past due, create next occurrence
            const nextOccurrence = get().getNextOccurrence(reminder);
            if (nextOccurrence) {
              get().updateReminder(reminder.id, {
                dueDate: nextOccurrence,
                status: "pending",
              });
            }
          }
        });
      },
      
      getNextOccurrence: (reminder) => {
        const currentDate = new Date(reminder.dueDate);
        
        switch (reminder.frequency) {
          case "daily":
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case "weekly":
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case "monthly":
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case "custom":
            if (reminder.customInterval) {
              currentDate.setDate(currentDate.getDate() + reminder.customInterval);
            } else if (reminder.customDays && reminder.customDays.length > 0) {
              // Find next matching day of week
              const currentDay = currentDate.getDay();
              const sortedDays = [...reminder.customDays].sort((a, b) => a - b);
              
              let nextDay = sortedDays.find((day) => day > currentDay);
              if (nextDay === undefined) {
                nextDay = sortedDays[0];
                currentDate.setDate(currentDate.getDate() + 7);
              }
              
              const daysToAdd = nextDay - currentDay;
              currentDate.setDate(currentDate.getDate() + daysToAdd);
            }
            break;
          default:
            return null;
        }
        
        return currentDate.toISOString();
      },
      
      resetReminders: () => {
        set({ reminders: [] });
      },
    }),
    {
      name: "reminder-storage",
    }
  )
);
