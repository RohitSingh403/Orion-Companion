import { useEffect } from "react";
import { useFocusStore } from "../store/focusStore";
import { useTaskStore } from "../store/taskStore";
import { isSideSurface } from "../utils/surface";

export default function useTray() {
  const running = useFocusStore((state) => state.running);
  const session = useFocusStore((state) => state.session);
  const remainingTime = useFocusStore((state) => state.remainingTime);
  const start = useFocusStore((state) => state.start);
  const pause = useFocusStore((state) => state.pause);
  const reset = useFocusStore((state) => state.reset);
  const addTask = useTaskStore((state) => state.addTask);

  useEffect(() => {
    if (isSideSurface()) return;

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    const status = running ? `${session === "focus" ? "Focus" : "Break"} ${time}` : "Ready";
    window.focusAPI?.updateTrayStatus(status);
    window.focusAPI?.reportTimer?.({ remainingTime, running, session });
    window.focusAPI?.watchActivity?.(running && session === "focus");
  }, [running, session, remainingTime]);

  useEffect(() => {
    if (!window.focusAPI || isSideSurface()) return;

    window.focusAPI.onTrayStartFocus(() => useFocusStore.getState().start());
    window.focusAPI.onTrayPauseFocus(() => useFocusStore.getState().pause());
    window.focusAPI.onTrayResumeFocus(() => useFocusStore.getState().start());
    window.focusAPI.onTrayQuickAddTask(() => {
      window.dispatchEvent(new CustomEvent("orion-quick-add"));
    });
    window.focusAPI.onTrayShowProgress(() => {
      window.location.assign("/analytics");
    });
    window.focusAPI.onGlobalShortcutQuickCapture(() => {
      window.dispatchEvent(new CustomEvent("orion-quick-add"));
    });
    window.focusAPI.onMiniCommand?.((command) => {
      const store = useFocusStore.getState();
      if (command === "start") store.start();
      if (command === "pause") store.pause();
      if (command === "reset") store.reset();
    });
    window.focusAPI.onActivitySample?.((name) => {
      useFocusStore.getState().recordActivity(name, 15);
    });
  }, [addTask, pause, reset, start]);
}
