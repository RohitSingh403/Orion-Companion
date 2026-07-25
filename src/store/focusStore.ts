import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayString, getYesterdayString } from "../utils/date";

export type SessionType = "focus" | "break";

export interface SessionHistoryItem {
  id: string;
  time: string;
  type: "Focus Session";
}

// ----------------------
// Default Values
// ----------------------

const DEFAULT_FOCUS_DURATION = 25 * 60;
const DEFAULT_BREAK_DURATION = 5 * 60;
const DEFAULT_DAILY_GOAL = 8;

interface FocusState {
  session: SessionType;

  focusDuration: number;
  breakDuration: number;

  dailyGoal: number;

  remainingTime: number;

  running: boolean;

  completedSessions: number;

  // Session History
  history: SessionHistoryItem[];

  // Streak
  currentStreak: number;
  lastCompletedDate: string | null;

  start: () => void;
  pause: () => void;
  reset: () => void;

  tick: () => void;

  addHistory: () => void;
  updateStreak: () => void;

  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
  setDailyGoal: (goal: number) => void;

  // ----------------------
  // Reset Actions
  // ----------------------

  resetHistory: () => void;
  resetTodayProgress: () => void;
  resetStreak: () => void;
  resetSettings: () => void;
  resetAllData: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      session: "focus",

      focusDuration: DEFAULT_FOCUS_DURATION,
      breakDuration: DEFAULT_BREAK_DURATION,

      dailyGoal: DEFAULT_DAILY_GOAL,

      remainingTime: DEFAULT_FOCUS_DURATION,

      running: false,

      completedSessions: 0,

      history: [],

      currentStreak: 0,
      lastCompletedDate: null,

      start: () =>
        set({
          running: true,
        }),

      pause: () =>
        set({
          running: false,
        }),

      reset: () =>
        set((state) => ({
          session: "focus",
          running: false,
          remainingTime: state.focusDuration,
        })),

      tick: () => {
        const state = get();

        if (!state.running) return;

        if (state.remainingTime > 1) {
          set({
            remainingTime: state.remainingTime - 1,
          });
          return;
        }

        // Focus completed
        if (state.session === "focus") {
          get().addHistory();
          get().updateStreak();

          set({
            session: "break",
            remainingTime: state.breakDuration,
            completedSessions: state.completedSessions + 1,
          });

          return;
        }

        // Break completed
        set({
          session: "focus",
          remainingTime: state.focusDuration,
        });
      },

      addHistory: () => {
        const state = get();

        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        set({
          history: [
            {
              id: crypto.randomUUID(),
              time: currentTime,
              type: "Focus Session",
            },
            ...state.history,
          ],
        });
      },

      updateStreak: () => {
        const state = get();

        const today = getTodayString();
        const yesterday = getYesterdayString();

        if (state.lastCompletedDate === today) return;

        if (state.lastCompletedDate === yesterday) {
          set({
            currentStreak: state.currentStreak + 1,
            lastCompletedDate: today,
          });
          return;
        }

        set({
          currentStreak: 1,
          lastCompletedDate: today,
        });
      },

      setFocusDuration: (minutes) =>
        set((state) => ({
          focusDuration: minutes * 60,
          remainingTime:
            state.session === "focus" ? minutes * 60 : state.remainingTime,
        })),

      setBreakDuration: (minutes) =>
        set((state) => ({
          breakDuration: minutes * 60,
          remainingTime:
            state.session === "break" ? minutes * 60 : state.remainingTime,
        })),

      setDailyGoal: (goal) =>
        set({
          dailyGoal: goal,
        }),

      // ----------------------
      // Reset Actions
      // ----------------------

      resetHistory: () =>
        set({
          history: [],
        }),

      resetTodayProgress: () =>
        set({
          completedSessions: 0,
        }),

      resetStreak: () =>
        set({
          currentStreak: 0,
          lastCompletedDate: null,
        }),

      resetSettings: () =>
        set({
          focusDuration: DEFAULT_FOCUS_DURATION,
          breakDuration: DEFAULT_BREAK_DURATION,
          dailyGoal: DEFAULT_DAILY_GOAL,
          remainingTime: DEFAULT_FOCUS_DURATION,
        }),

      resetAllData: () =>
        set({
          session: "focus",
          running: false,

          focusDuration: DEFAULT_FOCUS_DURATION,
          breakDuration: DEFAULT_BREAK_DURATION,

          dailyGoal: DEFAULT_DAILY_GOAL,

          remainingTime: DEFAULT_FOCUS_DURATION,

          completedSessions: 0,

          history: [],

          currentStreak: 0,
          lastCompletedDate: null,
        }),
    }),
    {
      name: "focus-companion-storage",

      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        dailyGoal: state.dailyGoal,

        completedSessions: state.completedSessions,
        history: state.history,

        currentStreak: state.currentStreak,
        lastCompletedDate: state.lastCompletedDate,
      }),
    },
  ),
);
