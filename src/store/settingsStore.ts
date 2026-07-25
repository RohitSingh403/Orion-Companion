import { create } from "zustand";

interface SettingsState {
  focusMinutes: number;
  breakMinutes: number;

  autoStartBreak: boolean;
  autoStartFocus: boolean;

  soundEnabled: boolean;

  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;

  toggleSound: () => void;
}

export const useSettingsStore =
  create<SettingsState>((set) => ({
    focusMinutes: 25,
    breakMinutes: 5,

    autoStartBreak: false,
    autoStartFocus: false,

    soundEnabled: true,

    setFocusMinutes: (minutes) =>
      set({
        focusMinutes: minutes,
      }),

    setBreakMinutes: (minutes) =>
      set({
        breakMinutes: minutes,
      }),

    toggleSound: () =>
      set((state) => ({
        soundEnabled: !state.soundEnabled,
      })),
  }));