export type ReminderFrequency = "once" | "daily" | "weekly" | "monthly" | "custom";

export type ReminderStatus = "pending" | "completed" | "dismissed";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  dueTime?: string; // HH:MM format
  frequency: ReminderFrequency;
  status: ReminderStatus;
  taskId?: string; // Link to a task
  createdAt: string;
  completedAt?: string;
  customDays?: number[]; // For custom frequency (0 = Sunday, 6 = Saturday)
  customInterval?: number; // For custom frequency (e.g., every 3 days)
}
