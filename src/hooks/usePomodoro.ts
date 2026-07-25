import { useEffect, useRef } from "react";
import { useFocusStore } from "../store/focusStore";

declare global {
  interface Window {
    focusAPI?: {
      showBreakNotification: () => void;
    };
  }
}

export default function usePomodoro() {
  const running = useFocusStore((s) => s.running);
  const tick = useFocusStore((s) => s.tick);
  const session = useFocusStore((s) => s.session);

  // Remember the previous session so we can detect
  // when Focus -> Break happens.
  const previousSession = useRef(session);

  useEffect(() => {
    if (
      previousSession.current === "focus" &&
      session === "break"
    ) {
      window.focusAPI?.showBreakNotification();
    }

    previousSession.current = session;
  }, [session]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [running, tick]);
}