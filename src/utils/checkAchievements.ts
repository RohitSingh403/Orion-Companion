import { useAchievementStore } from "../store/achievementStore";
import { useFocusStore } from "../store/focusStore";
import { useTaskStore } from "../store/taskStore";
import { getTodayString } from "./date";

function unlock(id: string) {
  const achievements = useAchievementStore.getState();
  if (!achievements.isUnlocked(id)) {
    achievements.unlockAchievement(id);
  }
}

export function checkFocusAchievements() {
  const focus = useFocusStore.getState();
  const tasks = useTaskStore.getState();
  const sessions = focus.completedSessions;
  const focusMinutes = focus.history.reduce((sum, item) => sum + item.duration / 60, 0);
  const streak = focus.currentStreak;
  const completedTasks = tasks.tasks.filter((task) => task.completed).length;
  const today = getTodayString();
  const todaySessions = focus.history.filter((item) => item.date === today).length;
  const hour = new Date().getHours();

  if (sessions >= 1) unlock("first-session");
  if (sessions >= 10) unlock("ten-sessions");
  if (sessions >= 50) unlock("fifty-sessions");
  if (sessions >= 100) unlock("hundred-sessions");
  if (sessions >= 500) unlock("five-hundred-sessions");
  if (sessions >= 1000) unlock("thousand-sessions");

  if (streak >= 3) unlock("three-day-streak");
  if (streak >= 7) unlock("seven-day-streak");
  if (streak >= 14) unlock("fourteen-day-streak");
  if (streak >= 30) unlock("thirty-day-streak");
  if (streak >= 100) unlock("hundred-day-streak");

  if (focusMinutes >= 60) unlock("one-hour-focus");
  if (focusMinutes >= 600) unlock("ten-hours-focus");
  if (focusMinutes >= 3000) unlock("fifty-hours-focus");
  if (focusMinutes >= 6000) unlock("hundred-hours-focus");

  if (completedTasks >= 1) unlock("first-task");
  if (completedTasks >= 10) unlock("ten-tasks");
  if (completedTasks >= 50) unlock("fifty-tasks");
  if (completedTasks >= 100) unlock("hundred-tasks");

  if (focus.dailyGoal > 0 && todaySessions >= focus.dailyGoal) unlock("perfect-day");
  if (hour < 8 && sessions >= 1) unlock("early-bird");
  if (hour >= 22 && sessions >= 1) unlock("night-owl");
}
