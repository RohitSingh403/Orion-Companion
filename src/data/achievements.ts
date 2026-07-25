import { Achievement } from "../types/achievement";

export const defaultAchievements: Achievement[] = [
  {
    id: "first-session",
    title: "First Focus",
    description: "Complete your first focus session.",
    unlocked: false,
  },
  {
    id: "ten-sessions",
    title: "Getting Started",
    description: "Complete 10 focus sessions.",
    unlocked: false,
  },
  {
    id: "fifty-sessions",
    title: "Focus Master",
    description: "Complete 50 focus sessions.",
    unlocked: false,
  },
  {
    id: "hundred-sessions",
    title: "Deep Worker",
    description: "Complete 100 focus sessions.",
    unlocked: false,
  },
  {
    id: "seven-day-streak",
    title: "Consistency",
    description: "Maintain a 7-day streak.",
    unlocked: false,
  },
];
