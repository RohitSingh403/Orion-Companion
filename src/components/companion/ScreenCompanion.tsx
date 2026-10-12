import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useFocusStore } from "../../store/focusStore";
import { companionMessage, type CompanionSnapshot } from "../../utils/companionMessage";
import CompanionActor from "./CompanionActor";

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
  const passthrough = useRef<boolean | null>(null);
  const desktop = variant === "desktop";

  useEffect(() => {
    if (!desktop || !window.focusAPI?.onTimerState) return undefined;
    return window.focusAPI.onTimerState(setRemote);
  }, [desktop]);

  useEffect(() => {
    if (!desktop || !window.focusAPI?.setCompanionMousePassthrough) return undefined;

    const sync = (event: MouseEvent) => {
      if (drag.current) return;
      const node = document.elementFromPoint(event.clientX, event.clientY);
      const hit = Boolean(node?.closest("[data-companion-hit]"));
      const ignore = !hit;
      if (passthrough.current === ignore) return;
      passthrough.current = ignore;
      window.focusAPI?.setCompanionMousePassthrough(ignore);
    };

    window.addEventListener("mousemove", sync);
    return () => {
      window.removeEventListener("mousemove", sync);
      window.focusAPI?.setCompanionMousePassthrough(false);
    };
  }, [desktop]);

  const snapshot = remote ?? { remainingTime, running, session };
  const line = companionMessage(snapshot);

  function toggle() {
    if (desktop) {
      window.focusAPI?.sendMiniCommand(snapshot.running ? "pause" : "start");
      return;
    }
    if (snapshot.running) pause();
    else start();
  }

  function onDragStart(event: PointerEvent<HTMLElement>) {
    if (!desktop || event.button !== 0) return;
    drag.current = { x: event.screenX, y: event.screenY };
    passthrough.current = false;
    window.focusAPI?.setCompanionMousePassthrough(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onDragMove(event: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    const dx = event.screenX - drag.current.x;
    const dy = event.screenY - drag.current.y;
    drag.current = { x: event.screenX, y: event.screenY };
    if (dx !== 0 || dy !== 0) window.focusAPI?.nudgeCompanion(dx, dy);
  }

  function onDragEnd() {
    drag.current = null;
  }

  return (
    <aside
      className={desktop ? "h-screen w-screen bg-transparent p-2" : "pointer-events-none fixed bottom-4 right-4 z-30 w-[250px]"}
      aria-label="Screen companion"
      data-companion-root
    >
      <div className={desktop ? "flex h-full flex-col justify-end" : "pointer-events-auto"}>
        <div data-companion-hit className="relative rounded-2xl border border-white/10 bg-[#1b1f27] px-3 py-2 text-[#f4f4f5]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">{line.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">{line.body}</p>
          <p className="mt-2 font-semibold tabular-nums text-[#8AF6FF]">{clock(snapshot.remainingTime)}</p>
          <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-[#1b1f27]" />
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div
            data-companion-hit
            className={desktop ? "cursor-grab touch-none" : ""}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <CompanionActor mode={line.mode} />
          </div>
          <div data-companion-hit className="mb-3 flex flex-col gap-1.5">
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
                onClick={() => window.focusAPI?.setCompanionVisible(false)}
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
