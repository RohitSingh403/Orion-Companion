import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionType = "focus" | "break";

export interface SessionHistoryItem {
  id: string;
  time: string;
  type: "Focus Session";
}

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

  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
  setDailyGoal: (goal: number) => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      session: "focus",

      // Testing values
      focusDuration: 20,
      breakDuration: 5 * 60,

      dailyGoal: 8,

      remainingTime: 20,

      running: false,

      completedSessions: 0,

      // Session History
      history: [],

      // Streak
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

        // Focus session completed
        if (state.session === "focus") {
          // ⭐ NEW
          get().addHistory();

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

      setFocusDuration: (minutes) =>
        set((state) => ({
          focusDuration: minutes * 60,
          remainingTime:
            state.session === "focus"
              ? minutes * 60
              : state.remainingTime,
        })),

      setBreakDuration: (minutes) =>
        set((state) => ({
          breakDuration: minutes * 60,
          remainingTime:
            state.session === "break"
              ? minutes * 60
              : state.remainingTime,
        })),

      setDailyGoal: (goal) =>
        set({
          dailyGoal: goal,
        }),
    }),
    {
      name: "focus-companion-storage",

      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        dailyGoal: state.dailyGoal,

        completedSessions: state.completedSessions,

        // Persist session history
        history: state.history,

        // Persist streak
        currentStreak: state.currentStreak,
        lastCompletedDate: state.lastCompletedDate,
      }),
    }
  )
);