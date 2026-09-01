// src/pages/MiniTimer/MiniTimerPage.tsx

import { useEffect } from "react";
import { useFocusStore } from "../../store/focusStore";
import { useSettingsStore } from "../../store/settingsStore";
import { FiPlay, FiPause, FiSkipForward } from "react-icons/fi";

export default function MiniTimerPage() {
  const { running, session, remainingTime, start, pause, reset } = useFocusStore();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Handle window close from renderer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`w-full h-full backdrop-blur-xl flex flex-col items-center justify-center p-4 ${
      isDark ? "bg-black/70 text-gray-100" : "bg-black/50 text-gray-900"
    }`}>
      {/* Timer Display */}
      <div className={`text-5xl font-semibold mb-2 tabular-nums tracking-tight ${
        isDark ? "text-violet-400" : "text-violet-600"
      }`}>
        {timeStr}
      </div>

      {/* Session Type */}
      <div className={`text-sm font-medium mb-4 uppercase tracking-wider px-3 py-1 rounded border ${
        isDark 
          ? "bg-violet-500/10 text-violet-400 border-violet-500/30" 
          : "bg-violet-50 text-violet-600 border-violet-200"
      }`}>
        {session === "focus" ? "Focus" : "Break"}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {running ? (
          <button
            onClick={pause}
            className={`p-2 rounded-lg transition-all ${
              isDark 
                ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100" 
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <FiPause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={start}
            className="w-10 h-10 rounded-full btn-primary flex items-center justify-center"
          >
            <FiPlay className="w-4 h-4 ml-0.5" />
          </button>
        )}

        <button
          onClick={reset}
          className={`p-2 rounded-lg transition-all ${
            isDark 
              ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100" 
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          <FiSkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
