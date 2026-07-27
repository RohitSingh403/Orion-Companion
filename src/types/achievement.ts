// src/types/achievement.ts

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon?: string;
  xp?: number;
}
