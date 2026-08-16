// src/hooks/usePomodoro.ts

import { useEffect, useRef } from "react";

import { useFocusStore } from "../store/focusStore";
import { useAchievementStore } from "../store/achievementStore";
import { useToastStore } from "../store/toastStore";
import { useTaskStore } from "../store/taskStore";
import { useSettingsStore } from "../store/settingsStore";

import { playSound } from "../utils/audio";

export default function usePomodoro() {
  const running = useFocusStore((s) => s.running);
  const tick = useFocusStore((s) => s.tick);
  const session = useFocusStore((s) => s.session);
  const completedSessions = useFocusStore((s) => s.completedSessions);
  const updateDailyStats = useFocusStore((s) => s.updateDailyStats);
  const start = useFocusStore((s) => s.start);

  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const incrementTaskFocusSession = useTaskStore(
    (s) => s.incrementTaskFocusSession
  );

  const unlockAchievement = useAchievementStore((s) => s.unlockAchievement);
  const isUnlocked = useAchievementStore((s) => s.isUnlocked);
  const addXP = useAchievementStore((s) => s.addXP);

  const showToast = useToastStore((s) => s.showToast);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const breakSound = useSettingsStore((s) => s.breakSound);
  const focusSound = useSettingsStore((s) => s.focusSound);
  const desktopNotifications = useSettingsStore((s) => s.desktopNotifications);
  const autoStartBreak = useSettingsStore((s) => s.autoStartBreak);
  const autoStartFocus = useSettingsStore((s) => s.autoStartFocus);

  const previousSession = useRef(session);

  // Detect session changes
  useEffect(() => {
    // Focus -> Break
    if (previousSession.current === "focus" && session === "break") {
      if (soundEnabled) {
        playSound(breakSound || "break.mp3");
      }

      if (desktopNotifications) {
        window.focusAPI?.showBreakNotification();
      }

      // Update daily statistics
      updateDailyStats();

      // Automatically increment task focus session if active task is selected
      if (activeTaskId) {
        incrementTaskFocusSession(activeTaskId);
      }

      // Add XP for completing a focus session
      addXP(10);

      // Achievement checks
      if (completedSessions === 1 && !isUnlocked("first-session")) {
        unlockAchievement("first-session");
        showToast("🏆 First Focus", "Completed your first focus session!");
      }

      if (completedSessions === 10 && !isUnlocked("ten-sessions")) {
        unlockAchievement("ten-sessions");
        showToast("🥈 Getting Started", "Completed 10 focus sessions!");
      }

      if (completedSessions === 50 && !isUnlocked("fifty-sessions")) {
        unlockAchievement("fifty-sessions");
        showToast("🥇 Focus Master", "Completed 50 focus sessions!");
      }

      if (completedSessions === 100 && !isUnlocked("hundred-sessions")) {
        unlockAchievement("hundred-sessions");
        showToast("👑 Deep Worker", "Completed 100 focus sessions!");
      }

      // Auto-start break if enabled
      if (autoStartBreak) {
        start();
      }
    }

    // Break -> Focus
    if (previousSession.current === "break" && session === "focus") {
      if (soundEnabled) {
        playSound(focusSound || "complete.mp3");
      }

      if (desktopNotifications) {
        window.focusAPI?.showFocusNotification();
      }

      // Auto-start focus if enabled
      if (autoStartFocus) {
        start();
      }
    }

    previousSession.current = session;
  }, [
    session,
    completedSessions,
    activeTaskId,
    incrementTaskFocusSession,
    unlockAchievement,
    isUnlocked,
    addXP,
    showToast,
    updateDailyStats,
    soundEnabled,
    breakSound,
    focusSound,
    desktopNotifications,
    autoStartBreak,
    autoStartFocus,
    start,
  ]);

  // Timer tick interval
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [running, tick]);
}
