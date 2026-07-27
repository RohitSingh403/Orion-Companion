// src/hooks/usePomodoro.ts

import { useEffect, useRef } from "react";

import { useFocusStore } from "../store/focusStore";
import { useAchievementStore } from "../store/achievementStore";
import { useToastStore } from "../store/toastStore";
import { useTaskStore } from "../store/taskStore";

import { playSound } from "../utils/audio";

declare global {
  interface Window {
    focusAPI?: {
      showBreakNotification: () => void;
      showFocusNotification: () => void;
    };
  }
}

export default function usePomodoro() {
  const running = useFocusStore((s) => s.running);
  const tick = useFocusStore((s) => s.tick);
  const session = useFocusStore((s) => s.session);
  const completedSessions = useFocusStore((s) => s.completedSessions);

  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const incrementTaskFocusSession = useTaskStore(
    (s) => s.incrementTaskFocusSession
  );

  const unlockAchievement = useAchievementStore((s) => s.unlockAchievement);
  const isUnlocked = useAchievementStore((s) => s.isUnlocked);

  const showToast = useToastStore((s) => s.showToast);

  const previousSession = useRef(session);

  // Detect session changes
  useEffect(() => {
    // Focus -> Break
    if (previousSession.current === "focus" && session === "break") {
      playSound("break.mp3");

      window.focusAPI?.showBreakNotification();

      // Automatically increment task focus session if active task is selected
      if (activeTaskId) {
        incrementTaskFocusSession(activeTaskId);
      }

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
    }

    // Break -> Focus
    if (previousSession.current === "break" && session === "focus") {
      playSound("complete.mp3");

      window.focusAPI?.showFocusNotification();
    }

    previousSession.current = session;
  }, [
    session,
    completedSessions,
    activeTaskId,
    incrementTaskFocusSession,
    unlockAchievement,
    isUnlocked,
    showToast,
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
