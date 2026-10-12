import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useFocusStore } from "../../store/focusStore";
import { companionMessage, type CompanionSnapshot } from "../../utils/companionMessage";

function clock(total: number) {
  const minutes = Math.floor(Math.max(0, total) / 60);
  const seconds = Math.max(0, total) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ScreenCompanion({ variant = "overlay" }: { variant?: "overlay" | "desktop" }) {
  const remainingTime = useFocusStore((state) => state.remainingTime);
  const running = useFocusStore((state) => state.running);
  const session = useFocusStore((state) => state.session);
  const start = useFocusStore((state) => state.start);
  const pause = useFocusStore((state) => state.pause);
  const [remote, setRemote] = useState<CompanionSnapshot | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (variant !== "desktop" || !window.focusAPI?.onTimerState) return undefined;
    return window.focusAPI.onTimerState(setRemote);
  }, [variant]);

  const snapshot = remote ?? { remainingTime, running, session };
  const line = companionMessage(snapshot);
  const desktop = variant === "desktop";

  function toggle() {
    if (desktop) {
      window.focusAPI?.sendMiniCommand(snapshot.running ? "pause" : "start");
      return;
    }
    if (snapshot.running) pause();
    else start();
  }

  function hide() {
    window.focusAPI?.setCompanionVisible(false);
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (!desktop || event.button !== 0) return;
    drag.current = { x: event.screenX, y: event.screenY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    const dx = event.screenX - drag.current.x;
    const dy = event.screenY - drag.current.y;
    drag.current = { x: event.screenX, y: event.screenY };
    if (dx !== 0 || dy !== 0) window.focusAPI?.nudgeCompanion(dx, dy);
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <aside
      className={desktop ? "h-screen w-screen bg-transparent p-2" : "pointer-events-none fixed bottom-4 right-4 z-30 w-[220px]"}
      aria-label="Screen companion"
    >
      <div className={desktop ? "flex h-full flex-col justify-end" : "pointer-events-auto"}>
        <div className="rounded-2xl border border-white/10 bg-[#1b1f27] px-3 py-2 text-[#f4f4f5]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">{line.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">{line.body}</p>
          <p className="mt-2 font-semibold tabular-nums text-[#8AF6FF]">{clock(snapshot.remainingTime)}</p>
        </div>
        <div
          className={`mt-1 flex items-end justify-between ${desktop ? "cursor-grab" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <img
            src={line.pose === "back" ? "/companion/back.png" : "/companion/front.png"}
            alt=""
            width={96}
            height={160}
            draggable={false}
            className="h-40 w-auto select-none"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="mb-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={toggle}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
            >
              {snapshot.running ? "Hold" : "Begin"}
            </button>
            {desktop && (
              <button
                type="button"
                onClick={() => window.focusAPI?.showMainWindow()}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Open app
              </button>
            )}
            {desktop && (
              <button
                type="button"
                onClick={hide}
                className="rounded-full px-3 py-1 text-[11px] text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Hide
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
