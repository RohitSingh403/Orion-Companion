import { create } from "zustand";
import type { AchievementRarity } from "../types/achievement";

interface ToastState {
  visible: boolean;

  title: string;

  message: string;

  rarity?: AchievementRarity;

  icon?: string;

  showToast: (title: string, message: string, rarity?: AchievementRarity, icon?: string) => void;

  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,

  title: "",

  message: "",

  rarity: "common",

  icon: undefined,

  showToast: (title, message, rarity = "common", icon) => {
    set({
      visible: true,
      title,
      message,
      rarity,
      icon,
    });

    setTimeout(() => {
      set({
        visible: false,
      });
    }, 4000);
  },

  hideToast: () =>
    set({
      visible: false,
    }),
}));
