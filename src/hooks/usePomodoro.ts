import { useEffect, useRef } from "react";

import { useFocusStore } from "../store/focusStore";
import { useAchievementStore } from "../store/achievementStore";
import { useToastStore } from "../store/toastStore";

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

  const unlockAchievement = useAchievementStore(
    (s) => s.unlockAchievement
  );

  const isUnlocked = useAchievementStore(
    (s) => s.isUnlocked
  );

  const showToast = useToastStore(
    (s) => s.showToast
  );

  const previousSession = useRef(session);

  // Detect session changes
  useEffect(() => {
    // Focus -> Break
    if (
      previousSession.current === "focus" &&
      session === "break"
    ) {
      playSound("break.mp3");

      window.focusAPI?.showBreakNotification();

      // First Focus
      if (
        completedSessions === 1 &&
        !isUnlocked("first-session")
      ) {
        unlockAchievement("first-session");

        showToast(
          "🏆 First Focus",
          "Completed your first focus session!"
        );
      }

      // 10 Sessions
      if (
        completedSessions === 10 &&
        !isUnlocked("ten-sessions")
      ) {
        unlockAchievement("ten-sessions");

        showToast(
          "🥈 Getting Started",
          "Completed 10 focus sessions!"
        );
      }

      // 50 Sessions
      if (
        completedSessions === 50 &&
        !isUnlocked("fifty-sessions")
      ) {
        unlockAchievement("fifty-sessions");

        showToast(
          "🥇 Focus Master",
          "Completed 50 focus sessions!"
        );
      }

      // 100 Sessions
      if (
        completedSessions === 100 &&
        !isUnlocked("hundred-sessions")
      ) {
        unlockAchievement("hundred-sessions");

        showToast(
          "👑 Deep Worker",
          "Completed 100 focus sessions!"
        );
      }
    }

    // Break -> Focus
    if (
      previousSession.current === "break" &&
      session === "focus"
    ) {
      playSound("complete.mp3");

      window.focusAPI?.showFocusNotification();
    }

    previousSession.current = session;
  }, [
    session,
    completedSessions,
    unlockAchievement,
    isUnlocked,
    showToast,
  ]);

  // Timer
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [running, tick]);
}