import { useEffect, useState } from "react";
import { FiPause, FiPlay, FiSkipForward } from "react-icons/fi";
import { useFocusStore } from "../../store/focusStore";

interface TimerSnapshot {
  remainingTime: number;
  running: boolean;
  session: "focus" | "break";
}

export default function MiniTimerPage() {
  const store = useFocusStore();
  const isMini = new URLSearchParams(window.location.search).get("surface") === "mini";
  const [remote, setRemote] = useState<TimerSnapshot | null>(null);

  useEffect(() => {
    if (!isMini) return;
    return window.focusAPI?.onTimerState?.(setRemote);
  }, [isMini]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const remainingTime = isMini ? remote?.remainingTime ?? store.remainingTime : store.remainingTime;
  const running = isMini ? remote?.running ?? false : store.running;
  const session = isMini ? remote?.session ?? store.session : store.session;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const send = (command: "start" | "pause" | "reset") => {
    if (isMini) {
      window.focusAPI?.sendMiniCommand?.(command);
      return;
    }
    if (command === "start") store.start();
    if (command === "pause") store.pause();
    if (command === "reset") store.reset();
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#121418] p-4 text-zinc-100">
      <div className="mb-2 font-semibold tabular-nums tracking-tight text-[#8AF6FF]" style={{ fontSize: 48 }}>
        {timeStr}
      </div>
      <div className="mb-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-300">
        {session === "focus" ? "Focus" : "Break"}
      </div>
      <div className="flex items-center gap-3">
        {running ? (
          <button
            onClick={() => send("pause")}
            className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10"
            aria-label="Pause"
          >
            <FiPause className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => send("start")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#14161c]"
            aria-label="Start"
          >
            <FiPlay className="ml-0.5 h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => send("reset")}
          className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          aria-label="Reset"
        >
          <FiSkipForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
