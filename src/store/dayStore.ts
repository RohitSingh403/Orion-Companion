import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayString } from "../utils/date";

export interface Capture {
  id: string;
  text: string;
  createdAt: string;
}

interface DayState {
  intentionDate: string;
  intention: string;
  captures: Capture[];
  allowedApps: string[];
  setIntention: (text: string) => void;
  addCapture: (text: string) => void;
  removeCapture: (id: string) => void;
  allowApp: (name: string) => void;
}

const DEFAULT_ALLOWED = ["Code", "Terminal", "Cursor", "Orion Companion"];

export function intentionFor(date: string, intentionDate: string, intention: string) {
  return intentionDate === date ? intention : "";
}

export const useDayStore = create<DayState>()(
  persist(
    (set, get) => ({
      intentionDate: "",
      intention: "",
      captures: [],
      allowedApps: DEFAULT_ALLOWED,

      setIntention: (text) =>
        set({
          intentionDate: getTodayString(),
          intention: text.slice(0, 160),
        }),

      addCapture: (text) => {
        const trimmed = text.trim().slice(0, 160);
        if (!trimmed) return;
        const capture: Capture = {
          id: crypto.randomUUID(),
          text: trimmed,
          createdAt: new Date().toISOString(),
        };
        set({ captures: [capture, ...get().captures].slice(0, 80) });
      },

      removeCapture: (id) =>
        set({
          captures: get().captures.filter((capture) => capture.id !== id),
        }),

      allowApp: (name) => {
        const trimmed = name.trim().slice(0, 80);
        if (!trimmed) return;
        const exists = get().allowedApps.some((item) => item.toLowerCase() === trimmed.toLowerCase());
        if (exists) return;
        set({ allowedApps: [...get().allowedApps, trimmed] });
      },
    }),
    { name: "focus-companion-day" }
  )
);
