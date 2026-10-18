import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompanionScale = "small" | "medium" | "large";

interface SettingsState {
  // Timer Settings
  focusMinutes: number;
  breakMinutes: number;
  dailyGoal: number;

  // Auto-start Settings
  autoStartBreak: boolean;
  autoStartFocus: boolean;

  // Sound Settings
  soundEnabled: boolean;
  breakSound: string;
  focusSound: string;

  // Notification Settings
  desktopNotifications: boolean;
  breakReminder: boolean;

  // Appearance Settings
  theme: "dark" | "light";
  displayName: string;
  companionEnabled: boolean;
  companionScale: CompanionScale;

  // Actions
  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  setDailyGoal: (goal: number) => void;
  setAutoStartBreak: (enabled: boolean) => void;
  setAutoStartFocus: (enabled: boolean) => void;
  toggleSound: () => void;
  setBreakSound: (sound: string) => void;
  setFocusSound: (sound: string) => void;
  setDesktopNotifications: (enabled: boolean) => void;
  setBreakReminder: (enabled: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  setDisplayName: (name: string) => void;
  setCompanionEnabled: (enabled: boolean) => void;
  setCompanionScale: (scale: CompanionScale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Timer Settings
      focusMinutes: 25,
      breakMinutes: 5,
      dailyGoal: 8,

      // Auto-start Settings
      autoStartBreak: false,
      autoStartFocus: false,

      // Sound Settings
      soundEnabled: true,
      breakSound: "break.mp3",
      focusSound: "complete.mp3",

      // Notification Settings
      desktopNotifications: true,
      breakReminder: true,

      // Appearance Settings
      theme: "dark",
      displayName: "",
      companionEnabled: true,
      companionScale: "medium",

      // Actions
      setFocusMinutes: (minutes) =>
        set({
          focusMinutes: minutes,
        }),

      setBreakMinutes: (minutes) =>
        set({
          breakMinutes: minutes,
        }),

      setDailyGoal: (goal) =>
        set({
          dailyGoal: goal,
        }),

      setAutoStartBreak: (enabled) =>
        set({
          autoStartBreak: enabled,
        }),

      setAutoStartFocus: (enabled) =>
        set({
          autoStartFocus: enabled,
        }),

      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),

      setBreakSound: (sound) =>
        set({
          breakSound: sound,
        }),

      setFocusSound: (sound) =>
        set({
          focusSound: sound,
        }),

      setDesktopNotifications: (enabled) =>
        set({
          desktopNotifications: enabled,
        }),

      setBreakReminder: (enabled) =>
        set({
          breakReminder: enabled,
        }),

      setTheme: (theme) =>
        set({
          theme,
        }),

      setDisplayName: (name) =>
        set({
          displayName: name,
        }),

      setCompanionEnabled: (enabled) =>
        set({
          companionEnabled: enabled,
        }),

      setCompanionScale: (companionScale) =>
        set({
          companionScale,
        }),
    }),
    {
      name: "focus-companion-settings",
    }
  )
);
