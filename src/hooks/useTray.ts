// src/hooks/useTray.ts

import { useEffect } from "react";
import { useFocusStore } from "../store/focusStore";
import { useTaskStore } from "../store/taskStore";

export default function useTray() {
  const { running, session, start, pause, remainingTime } = useFocusStore();
  const { addTask } = useTaskStore();

  useEffect(() => {
    // Update tray status based on focus state
    const updateStatus = () => {
      if (running) {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        window.focusAPI?.updateTrayStatus(`${session === "focus" ? "Focus" : "Break"} - ${timeStr}`);
      } else {
        window.focusAPI?.updateTrayStatus("Paused");
      }
    };

    updateStatus();

    // Update every second when running
    const interval = running ? setInterval(updateStatus, 1000) : undefined;
    return () => clearInterval(interval);
  }, [running, session, remainingTime]);

  useEffect(() => {
    // Handle tray events
    const handleStartFocus = () => {
      if (!running) {
        start();
      }
    };

    const handlePauseFocus = () => {
      if (running) {
        pause();
      }
    };

    const handleResumeFocus = () => {
      if (!running) {
        start();
      }
    };

    const handleQuickAddTask = () => {
      // This would open a quick add dialog
      // For now, just add a default task
      addTask("Quick Task from Tray");
    };

    const handleShowProgress = () => {
      // Navigate to analytics page
      // This would be handled by routing
      console.log("Show progress - navigate to analytics");
    };

    const handleGlobalShortcutQuickCapture = () => {
      // Show quick capture modal
      console.log("Quick capture triggered");
      // This would open a modal for quick task capture
    };

    // Register event listeners
    window.focusAPI?.onTrayStartFocus(handleStartFocus);
    window.focusAPI?.onTrayPauseFocus(handlePauseFocus);
    window.focusAPI?.onTrayResumeFocus(handleResumeFocus);
    window.focusAPI?.onTrayQuickAddTask(handleQuickAddTask);
    window.focusAPI?.onTrayShowProgress(handleShowProgress);
    window.focusAPI?.onGlobalShortcutQuickCapture(handleGlobalShortcutQuickCapture);

    // Cleanup
    return () => {
      // Note: Electron doesn't provide a way to remove listeners from IPC
      // This is a known limitation
    };
  }, [running, start, pause, addTask]);
}
