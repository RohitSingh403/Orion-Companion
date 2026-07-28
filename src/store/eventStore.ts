import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent, EventType } from "../types/event";

interface CreateEventData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type?: EventType;
  color?: string;
}

interface EventState {
  events: CalendarEvent[];
  addEvent: (data: CreateEventData) => void;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (startDate: Date, endDate: Date) => CalendarEvent[];
}

const EVENT_COLORS: Record<EventType, string> = {
  meeting: "#8b5cf6", // purple
  focus: "#10b981", // emerald
  break: "#3b82f6", // blue
  reminder: "#f59e0b", // amber
  other: "#6b7280", // gray
};

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (data) => {
        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description || null,
          startDate: data.startDate,
          endDate: data.endDate,
          type: data.type || "other",
          color: data.color || EVENT_COLORS[data.type || "other"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },

      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? { ...event, ...data, updatedAt: new Date().toISOString() }
              : event
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      getEventsForDate: (date) => {
        const { events } = get();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return events.filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate >= startOfDay && eventDate <= endOfDay;
        });
      },

      getEventsForRange: (startDate, endDate) => {
        const { events } = get();
        return events.filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate >= startDate && eventDate <= endDate;
        });
      },
    }),
    {
      name: "focus-companion-events",
    }
  )
);
