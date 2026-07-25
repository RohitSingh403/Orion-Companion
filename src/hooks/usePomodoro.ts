import { useEffect } from "react";
import { useFocusStore } from "../store/focusStore";

export default function usePomodoro() {
  const running = useFocusStore((s) => s.running);
  const tick = useFocusStore((s) => s.tick);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [running, tick]);
}