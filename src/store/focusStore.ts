import { create } from "zustand";

export type SessionType = "focus" | "break";

interface FocusState {
  session: SessionType;

  focusDuration: number;
  breakDuration: number;

  remainingTime: number;

  running: boolean;

  completedSessions: number;

  start: () => void;
  pause: () => void;
  reset: () => void;

  tick: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  session: "focus",

  // focusDuration: 25 * 60,
  focusDuration:20 ,

  breakDuration: 5 * 60,

  // remainingTime: 25 * 60,
  remainingTime: 20,

  running: false,

  completedSessions: 0,

  start: () => set({ running: true }),

  pause: () => set({ running: false }),

  reset: () =>
    set({
      session: "focus",
      running: false,
      remainingTime: 25 * 60,
      completedSessions: 0,
    }),

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
}));