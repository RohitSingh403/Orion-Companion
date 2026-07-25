import { useEffect, useRef } from "react";

import { useFocusStore } from "../store/focusStore";
import { useAchievementStore } from "../store/achievementStore";

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
  const completedSessions = useFocusStore(
    (s) => s.completedSessions
  );

  const unlockAchievement = useAchievementStore(
    (s) => s.unlockAchievement
  );

  const isUnlocked = useAchievementStore(
    (s) => s.isUnlocked
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

      // First Focus Achievement
      if (
        completedSessions === 1 &&
        !isUnlocked("first-session")
      ) {
        unlockAchievement("first-session");
      }

      // 10 Sessions Achievement
      if (
        completedSessions === 10 &&
        !isUnlocked("ten-sessions")
      ) {
        unlockAchievement("ten-sessions");
      }

      // 50 Sessions Achievement
      if (
        completedSessions === 50 &&
        !isUnlocked("fifty-sessions")
      ) {
        unlockAchievement("fifty-sessions");
      }

      // 100 Sessions Achievement
      if (
        completedSessions === 100 &&
        !isUnlocked("hundred-sessions")
      ) {
        unlockAchievement("hundred-sessions");
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