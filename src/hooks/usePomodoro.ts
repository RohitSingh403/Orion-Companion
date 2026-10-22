import { useEffect, useRef } from "react";

import { useAchievementStore } from "../store/achievementStore";
import { useFocusStore } from "../store/focusStore";
import { useTaskStore } from "../store/taskStore";
import { useSettingsStore } from "../store/settingsStore";

import { playSound } from "../utils/audio";
import { checkFocusAchievements } from "../utils/checkAchievements";

import { isSideSurface } from "../utils/surface";

function notifySession(kind: "break" | "focus") {
  if (kind === "break") {
    if (window.focusAPI) {
      window.focusAPI.showBreakNotification();
      return;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Break time", { body: "Stand up, stretch, and drink some water." });
    }
    return;
  }

  if (window.focusAPI) {
    window.focusAPI.showFocusNotification();
    return;
  }
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("Focus time", { body: "Your break is over. Ready for another session?" });
  }
}

export default function usePomodoro() {
  const running = useFocusStore((s) => s.running);
  const tick = useFocusStore((s) => s.tick);
  const session = useFocusStore((s) => s.session);
  const updateDailyStats = useFocusStore((s) => s.updateDailyStats);
  const start = useFocusStore((s) => s.start);

  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const incrementTaskFocusSession = useTaskStore((s) => s.incrementTaskFocusSession);
  const addXP = useAchievementStore((s) => s.addXP);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const breakSound = useSettingsStore((s) => s.breakSound);
  const focusSound = useSettingsStore((s) => s.focusSound);
  const desktopNotifications = useSettingsStore((s) => s.desktopNotifications);
  const autoStartBreak = useSettingsStore((s) => s.autoStartBreak);
  const autoStartFocus = useSettingsStore((s) => s.autoStartFocus);

  const previousSession = useRef(session);

  useEffect(() => {
    if (isSideSurface() || !desktopNotifications || window.focusAPI) return;
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, [desktopNotifications]);

  useEffect(() => {
    if (isSideSurface()) return;

    if (previousSession.current === "focus" && session === "break") {
      if (soundEnabled) playSound(breakSound || "break.mp3");
      if (desktopNotifications) notifySession("break");
      updateDailyStats();
      if (activeTaskId) {
        incrementTaskFocusSession(activeTaskId);
        const minutes = Math.max(1, Math.round(useFocusStore.getState().focusDuration / 60));
        useTaskStore.getState().addTimeSpent(activeTaskId, minutes);
      }
      addXP(10);
      checkFocusAchievements();
      if (autoStartBreak) start();
    }

    if (previousSession.current === "break" && session === "focus") {
      if (soundEnabled) playSound(focusSound || "complete.mp3");
      if (desktopNotifications) notifySession("focus");
      if (autoStartFocus) start();
    }

    previousSession.current = session;
  }, [
    session,
    activeTaskId,
    incrementTaskFocusSession,
    addXP,
    updateDailyStats,
    soundEnabled,
    breakSound,
    focusSound,
    desktopNotifications,
    autoStartBreak,
    autoStartFocus,
    start,
  ]);

  useEffect(() => {
    if (!running || isSideSurface()) return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [running, tick]);
}
