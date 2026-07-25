import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Achievement } from "../types/achievement";
import { defaultAchievements } from "../data/achievements";

interface AchievementState {
  achievements: Achievement[];

  unlockAchievement: (id: string) => void;

  isUnlocked: (id: string) => boolean;

  resetAchievements: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: defaultAchievements,

      unlockAchievement: (id) => {
        const achievement = get().achievements.find(
          (a) => a.id === id
        );

        if (!achievement || achievement.unlocked) {
          return;
        }

        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id
              ? {
                  ...achievement,
                  unlocked: true,
                }
              : achievement
          ),
        }));
      },

      isUnlocked: (id) => {
        return get().achievements.some(
          (achievement) =>
            achievement.id === id &&
            achievement.unlocked
        );
      },

      resetAchievements: () =>
        set({
          achievements: defaultAchievements.map((achievement) => ({
            ...achievement,
          })),
        }),
    }),
    {
      name: "achievement-storage",
    }
  )
);