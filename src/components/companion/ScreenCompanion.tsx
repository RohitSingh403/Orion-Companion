import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createElement } from "react";
import { useFocusStore } from "../../store/focusStore";
import { useReminderStore } from "../../store/reminderStore";
import { companionMessage, type CompanionSnapshot } from "../../utils/companionMessage";
import CompanionActor, { type CompanionPose } from "./CompanionActor";

function clock(total: number) {
  const minutes = Math.floor(Math.max(0, total) / 60);
  const seconds = Math.max(0, total) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function copyStyles(target: Document) {
  [...document.styleSheets].forEach((sheet) => {
    try {
      const css = [...sheet.cssRules].map((rule) => rule.cssText).join("");
      const style = target.createElement("style");
      style.textContent = css;
      target.head.appendChild(style);
    } catch {
      if (sheet.href) {
        const link = target.createElement("link");
        link.rel = "stylesheet";
        link.href = sheet.href;
        target.head.appendChild(link);
      }
    }
  });
}

type PipHost = Window & {
  documentPictureInPicture?: {
    requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
  };
};

export default function ScreenCompanion({
  variant = "overlay",
  floating = false,
}: {
  variant?: "overlay" | "desktop";
  floating?: boolean;
}) {
  const remainingTime = useFocusStore((state) => state.remainingTime);
  const running = useFocusStore((state) => state.running);
  const session = useFocusStore((state) => state.session);
  const start = useFocusStore((state) => state.start);
  const pause = useFocusStore((state) => state.pause);
  const reminders = useReminderStore((state) => state.reminders);
  const [remote, setRemote] = useState<CompanionSnapshot | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [floated, setFloated] = useState(false);
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [spot, setSpot] = useState({ left: 0, ready: false });
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const passthrough = useRef<boolean | null>(null);
  const pipRoot = useRef<Root | null>(null);
  const desktop = variant === "desktop";
  const canFloat = !desktop && !floating && "documentPictureInPicture" in window;

  useEffect(() => {
    if (!desktop || !window.focusAPI?.onTimerState) return undefined;
    return window.focusAPI.onTimerState(setRemote);
  }, [desktop]);

  useEffect(() => {
    if (!desktop || !window.focusAPI?.onCompanionWalk) return undefined;
    return window.focusAPI.onCompanionWalk((state) => {
      setWalking(state.walking);
      setFacing(state.facing);
    });
  }, [desktop]);

  useEffect(() => {
    const refresh = () => {
      void useReminderStore.persist.rehydrate();
      setNow(Date.now());
    };
    window.addEventListener("storage", refresh);
    const id = window.setInterval(refresh, 15000);
    return () => {
      window.removeEventListener("storage", refresh);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!desktop || !window.focusAPI?.setCompanionMousePassthrough) return undefined;

    const sync = (event: MouseEvent) => {
      if (drag.current) return;
      const node = document.elementFromPoint(event.clientX, event.clientY);
      const hit = Boolean(node?.closest("[data-companion-hit]"));
      const ignore = !hit;
      if (passthrough.current === ignore) return;
      passthrough.current = ignore;
      setHovering(!ignore);
      window.focusAPI?.setCompanionMousePassthrough(ignore);
    };

    window.addEventListener("mousemove", sync);
    return () => {
      window.removeEventListener("mousemove", sync);
      window.focusAPI?.setCompanionMousePassthrough(false);
    };
  }, [desktop]);

  const snapshot = remote ?? { remainingTime, running, session };
  const line = companionMessage(snapshot, reminders, now);
  const pose: CompanionPose = walking && line.mode === "idle" ? "walk" : line.mode;

  useEffect(() => {
    if (!desktop) return;
    window.focusAPI?.setCompanionActivity({
      mode: line.mode,
      dragging: dragging || hovering,
    });
  }, [desktop, line.mode, dragging, hovering]);

  useEffect(() => {
    if (desktop || floating || line.mode !== "idle") {
      setWalking(false);
      return undefined;
    }
    const min = 88;
    let left = Math.max(min, window.innerWidth - 280);
    let dir: 1 | -1 = -1;
    let remaining = 0;
    let pausedUntil = Date.now() + 1200;
    setSpot({ left, ready: true });
    const id = window.setInterval(() => {
      if (drag.current) {
        setWalking(false);
        return;
      }
      const time = Date.now();
      if (time < pausedUntil) {
        setWalking(false);
        return;
      }
      if (remaining <= 0) {
        remaining = 260 + Math.round(Math.random() * 220);
        dir = Math.random() > 0.5 ? 1 : -1;
      }
      const max = Math.max(min, window.innerWidth - 240);
      left = Math.min(max, Math.max(min, left + dir * 8));
      if (left <= min || left >= max) dir = dir === 1 ? -1 : 1;
      remaining -= 8;
      if (remaining <= 0) pausedUntil = time + 4000 + Math.round(Math.random() * 3000);
      setFacing(dir);
      setWalking(true);
      setSpot({ left, ready: true });
    }, 120);
    return () => window.clearInterval(id);
  }, [desktop, floating, line.mode]);

  function toggle() {
    if (desktop) {
      window.focusAPI?.sendMiniCommand(snapshot.running ? "pause" : "start");
      return;
    }
    if (snapshot.running) pause();
    else start();
  }

  function onDragStart(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    drag.current = { x: event.screenX, y: event.screenY };
    setDragging(true);
    if (desktop) {
      passthrough.current = false;
      window.focusAPI?.setCompanionMousePassthrough(false);
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onDragMove(event: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    const dx = event.screenX - drag.current.x;
    const dy = event.screenY - drag.current.y;
    drag.current = { x: event.screenX, y: event.screenY };
    if (desktop) {
      if (dx !== 0 || dy !== 0) window.focusAPI?.nudgeCompanion(dx, dy);
      return;
    }
    setSpot((current) => ({
      left: Math.min(window.innerWidth - 220, Math.max(8, current.left + dx)),
      ready: true,
    }));
  }

  function onDragEnd() {
    drag.current = null;
    setDragging(false);
  }

  async function floatOut() {
    const api = (window as PipHost).documentPictureInPicture;
    if (!api) return;
    const pip = await api.requestWindow({ width: 300, height: 390 });
    copyStyles(pip.document);
    pip.document.body.style.margin = "0";
    pip.document.body.style.background = "#161a22";
    const host = pip.document.createElement("div");
    pip.document.body.appendChild(host);
    pipRoot.current?.unmount();
    const root = createRoot(host);
    pipRoot.current = root;
    root.render(createElement(ScreenCompanion, { variant: "overlay", floating: true }));
    setFloated(true);
    pip.addEventListener("pagehide", () => {
      root.unmount();
      pipRoot.current = null;
      setFloated(false);
    });
  }

  if (floated) return null;

  const frameClass = floating
    ? "w-full bg-transparent p-3"
    : desktop
      ? "h-screen w-screen bg-transparent p-2"
      : `pointer-events-none fixed bottom-4 z-30 w-[250px] ${spot.ready ? "" : "right-4"}`;

  return (
    <aside
      className={frameClass}
      style={!desktop && !floating && spot.ready ? { left: spot.left, right: "auto" } : undefined}
      aria-label="Screen companion"
      data-companion-root
    >
      <div className={desktop || floating ? "flex h-full flex-col justify-end" : "pointer-events-auto"}>
        <div data-companion-hit className="relative rounded-2xl border border-white/10 bg-[#1b1f27] px-3 py-2 text-[#f4f4f5]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">{line.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">{line.body}</p>
          <p className="mt-2 font-semibold tabular-nums text-[#8AF6FF]">{clock(snapshot.remainingTime)}</p>
          <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-[#1b1f27]" />
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div
            data-companion-hit
            className={desktop || !floating ? "cursor-grab touch-none" : ""}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <CompanionActor mode={pose} facing={facing} />
          </div>
          <div data-companion-hit className="mb-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={toggle}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
            >
              {snapshot.running ? "Hold" : "Begin"}
            </button>
            {canFloat && (
              <button
                type="button"
                onClick={() => void floatOut()}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Float
              </button>
            )}
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
