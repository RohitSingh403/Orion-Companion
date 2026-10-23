import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayString } from "../utils/date";
import type { BreakStepId } from "../utils/dayLoop";

export interface Capture {
  id: string;
  text: string;
  createdAt: string;
}

export interface BreakChecks {
  water: boolean;
  stretch: boolean;
  look: boolean;
}

export interface SavedDay {
  date: string;
  markdown: string;
  savedAt: string;
}

interface DayState {
  intentionDate: string;
  intention: string;
  captures: Capture[];
  allowedApps: string[];
  breakCheckDate: string;
  breakChecks: BreakChecks;
  logs: SavedDay[];
  setIntention: (text: string) => void;
  addCapture: (text: string) => void;
  removeCapture: (id: string) => void;
  allowApp: (name: string) => void;
  toggleBreakCheck: (id: BreakStepId) => void;
  saveDay: (date: string, markdown: string) => void;
}

const EMPTY_CHECKS: BreakChecks = { water: false, stretch: false, look: false };

export function checksFor(date: string, breakCheckDate: string, checks: BreakChecks) {
  return breakCheckDate === date ? checks : EMPTY_CHECKS;
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
      breakCheckDate: "",
      breakChecks: EMPTY_CHECKS,
      logs: [],

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

      toggleBreakCheck: (id) => {
        const today = getTodayString();
        const current = get().breakCheckDate === today ? get().breakChecks : EMPTY_CHECKS;
        set({
          breakCheckDate: today,
          breakChecks: { ...current, [id]: !current[id] },
        });
      },

      saveDay: (date, markdown) => {
        const key = date.trim().slice(0, 10);
        const text = markdown.trim().slice(0, 20_000);
        if (!key || !text) return;
        const entry: SavedDay = { date: key, markdown: text, savedAt: new Date().toISOString() };
        const rest = get().logs.filter((item) => item.date !== key);
        set({
          logs: [entry, ...rest].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90),
        });
      },
    }),
    { name: "focus-companion-day" }
  )
);
