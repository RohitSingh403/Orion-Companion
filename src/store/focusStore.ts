import { create } from "zustand";

export type SessionType = "focus" | "break";

interface FocusState {
  session: SessionType;

  focusDuration: number;
  breakDuration: number;

  dailyGoal: number;

  remainingTime: number;

  running: boolean;

  completedSessions: number;

  start: () => void;
  pause: () => void;
  reset: () => void;

  tick: () => void;

  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
  setDailyGoal: (goal: number) => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  session: "focus",

  // Testing values (20 seconds)
  focusDuration: 20,
  breakDuration: 5 * 60,

  dailyGoal: 8,

  remainingTime: 20,

  running: false,

  completedSessions: 0,

  start: () => set({ running: true }),

  pause: () => set({ running: false }),

  reset: () =>
    set((state) => ({
      session: "focus",
      running: false,
      remainingTime: state.focusDuration,
      completedSessions: 0,
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

    if (state.session === "focus") {
      set({
        session: "break",
        remainingTime: state.breakDuration,
        completedSessions: state.completedSessions + 1,
      });
      return;
    }

    set({
      session: "focus",
      remainingTime: state.focusDuration,
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
}));