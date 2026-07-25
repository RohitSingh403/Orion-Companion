import { useEffect, useRef } from "react";
import { useFocusStore } from "../store/focusStore";

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

  const previousSession = useRef(session);

  // Detect session changes
  useEffect(() => {
    // Focus -> Break
    if (
      previousSession.current === "focus" &&
      session === "break"
    ) {
      window.focusAPI?.showBreakNotification();
    }

    // Break -> Focus
    if (
      previousSession.current === "break" &&
      session === "focus"
    ) {
      window.focusAPI?.showFocusNotification();
    }

    previousSession.current = session;
  }, [session]);

  // Timer
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [running, tick]);
}