import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Achievement } from "../types/achievement";
import { defaultAchievements } from "../data/achievements";
import { useToastStore } from "./toastStore";

interface AchievementState {
  achievements: Achievement[];
  totalXP: number;
  level: number;
  xpToNextLevel: number;

  unlockAchievement: (id: string) => void;
  addXP: (amount: number) => void;
  checkLevelUp: () => void;

  isUnlocked: (id: string) => boolean;

  resetAchievements: () => void;
}

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 1000) + 1;
};

const calculateXPToNextLevel = (xp: number): number => {
  const level = calculateLevel(xp);
  return level * 1000 - xp;
};

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: defaultAchievements,
      totalXP: 0,
      level: 1,
      xpToNextLevel: 1000,

      unlockAchievement: (id) => {
        const achievement = get().achievements.find((a) => a.id === id);

        if (!achievement || achievement.unlocked) {
          return;
        }

        const xpReward = achievement.xp || 100;

        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id
              ? {
                  ...achievement,
                  unlocked: true,
                  unlockedAt: new Date().toISOString(),
                }
              : achievement,
          ),
          totalXP: state.totalXP + xpReward,
        }));

        get().checkLevelUp();

        // Show toast with rarity and icon
        const { showToast } = useToastStore.getState();
        showToast(
          achievement.title,
          achievement.description,
          achievement.rarity,
          achievement.icon
        );
      },

      addXP: (amount) => {
        set((state) => ({
          totalXP: state.totalXP + amount,
        }));
        get().checkLevelUp();
      },

      checkLevelUp: () => {
        const { totalXP } = get();
        const newLevel = calculateLevel(totalXP);
        const newXpToNextLevel = calculateXPToNextLevel(totalXP);

        set({
          level: newLevel,
          xpToNextLevel: newXpToNextLevel,
        });
      },

      isUnlocked: (id) => {
        return get().achievements.some(
          (achievement) => achievement.id === id && achievement.unlocked,
        );
      },

      resetAchievements: () =>
        set({
          achievements: defaultAchievements.map((achievement) => ({
            ...achievement,
          })),
          totalXP: 0,
          level: 1,
          xpToNextLevel: 1000,
        }),
    }),
    {
      name: "focus-companion-achievements-v2",
      version: 1,
    },
  ),
);
