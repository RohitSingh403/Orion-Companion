import { Achievement } from "../types/achievement";

export const defaultAchievements: Achievement[] = [
  {
    id: "first-session",
    title: "First Steps",
    description: "Complete your first focus session.",
    unlocked: true,
    icon: "🌱",
    xp: 50,
  },
  {
    id: "ten-sessions",
    title: "Getting Started",
    description: "Complete 10 focus sessions.",
    unlocked: false,
    icon: "🚀",
    xp: 100,
  },
  {
    id: "fifty-sessions",
    title: "Deep Focus",
    description: "Complete 50 focus sessions.",
    unlocked: false,
    icon: "🧠",
    xp: 150,
  },
  {
    id: "hundred-sessions",
    title: "Deep Worker",
    description: "Complete 100 focus sessions.",
    unlocked: false,
    icon: "👑",
    xp: 300,
  },
  {
    id: "seven-day-streak",
    title: "Early Bird",
    description: "Maintain a 7-day streak.",
    unlocked: false,
    icon: "🌅",
    xp: 200,
  },
];
