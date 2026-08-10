// src/pages/MiniTimer/MiniTimerPage.tsx

import { useEffect } from "react";
import { useFocusStore } from "../../store/focusStore";
import { FiPlay, FiPause, FiSkipForward } from "react-icons/fi";

export default function MiniTimerPage() {
  const { running, session, remainingTime, start, pause, reset } = useFocusStore();

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
    <div className="w-full h-full bg-zinc-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-zinc-100">
      {/* Timer Display */}
      <div className="text-5xl font-bold mb-2 tabular-nums tracking-tight text-gradient-emerald">
        {timeStr}
      </div>

      {/* Session Type */}
      <div className="text-xs font-medium text-zinc-400 mb-4 uppercase tracking-wider badge-premium">
        {session === "focus" ? "Focus" : "Break"}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {running ? (
          <button
            onClick={pause}
            className="w-10 h-10 rounded-full glass-card border border-zinc-700/50 hover:border-zinc-600/50 flex items-center justify-center transition-all"
          >
            <FiPause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={start}
            className="w-10 h-10 rounded-full btn-premium flex items-center justify-center transition-all text-zinc-950 glow-emerald"
          >
            <FiPlay className="w-4 h-4 ml-0.5" />
          </button>
        )}

        <button
          onClick={reset}
          className="w-10 h-10 rounded-full glass-card border border-zinc-700/50 hover:border-zinc-600/50 flex items-center justify-center transition-all"
        >
          <FiSkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
