// src/types/achievement.ts

export type AchievementCategory = "streak" | "sessions" | "time" | "tasks" | "special";
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon?: string;
  xp?: number;
  category?: AchievementCategory;
  rarity?: AchievementRarity;
  unlockedAt?: string;
}
