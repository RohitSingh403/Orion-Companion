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
  exportToICS: (startDate?: Date, endDate?: Date) => string;
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

      exportToICS: (startDate, endDate) => {
        const { events } = get();
        let eventsToExport = events;

        if (startDate && endDate) {
          eventsToExport = events.filter((event) => {
            const eventDate = new Date(event.startDate);
            return eventDate >= startDate && eventDate <= endDate;
          });
        }

        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Focus Companion//Calendar//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";

        eventsToExport.forEach((event) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          
          const formatDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          };

          icsContent += "BEGIN:VEVENT\n";
          icsContent += `UID:${event.id}@focuscompanion\n`;
          icsContent += `DTSTAMP:${formatDate(new Date(event.createdAt))}\n`;
          icsContent += `DTSTART:${formatDate(startDate)}\n`;
          icsContent += `DTEND:${formatDate(endDate)}\n`;
          icsContent += `SUMMARY:${event.title.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,")}\n`;
          if (event.description) {
            icsContent += `DESCRIPTION:${event.description.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")}\n`;
          }
          icsContent += `STATUS:CONFIRMED\n`;
          icsContent += "END:VEVENT\n";
        });

        icsContent += "END:VCALENDAR";
        return icsContent;
      },
    }),
    {
      name: "focus-companion-events",
    }
  )
);
