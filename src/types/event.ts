export type EventType = "meeting" | "focus" | "break" | "reminder" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: string; // ISO string
  endDate: string; // ISO string
  type: EventType;
  color: string;
  createdAt: string;
  updatedAt: string;
}
