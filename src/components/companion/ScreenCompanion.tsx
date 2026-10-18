import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createElement } from "react";
import { useFocusStore } from "../../store/focusStore";
import { useReminderStore } from "../../store/reminderStore";
import { companionMessage, type CompanionSnapshot } from "../../utils/companionMessage";
import CompanionActor, { type CompanionPose } from "./CompanionActor";
import CompanionControls from "./CompanionControls";
import { useSettingsStore } from "../../store/settingsStore";

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
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.innerWidth < 760);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [spot, setSpot] = useState({ left: 0, ready: false });
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [asleep, setAsleep] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scale = useSettingsStore((state) => state.companionScale);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const reactTimer = useRef<number | null>(null);
  const lastTouch = useRef(Date.now());
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
      void useSettingsStore.persist.rehydrate();
      setNow(Date.now());
    };
    window.addEventListener("storage", refresh);
    const id = window.setInterval(refresh, 15000);
    void useSettingsStore.persist.rehydrate();
    return () => {
      window.removeEventListener("storage", refresh);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!desktop || !window.focusAPI?.setCompanionHits) return undefined;
    const send = () => {
      const rects = [...document.querySelectorAll("[data-companion-hit]")].map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      });
      window.focusAPI?.setCompanionHits(rects);
    };
    send();
    const id = window.setInterval(send, 200);
    return () => window.clearInterval(id);
  }, [desktop, reacting, asleep]);

  const snapshot = remote ?? { remainingTime, running, session };
  const line = companionMessage(snapshot, reminders, now);
  const pose: CompanionPose =
    line.mode === "focus" || line.mode === "break"
      ? line.mode
      : reacting
        ? "react"
        : walking
          ? "walk"
          : asleep
            ? "sleep"
            : "idle";

  useEffect(() => {
    const id = window.setInterval(() => {
      if (line.mode !== "idle" || dragging || reacting) {
        setAsleep(false);
        return;
      }
      if (Date.now() - lastTouch.current >= 12000) setAsleep(true);
    }, 500);
    return () => window.clearInterval(id);
  }, [line.mode, dragging, reacting]);

  useEffect(() => {
    if (!desktop) return;
    window.focusAPI?.setCompanionActivity({
      mode: line.mode,
      dragging: dragging || hovering || reacting || asleep || menuOpen,
    });
  }, [desktop, line.mode, dragging, hovering, reacting, asleep, menuOpen]);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 760);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (desktop || floating || narrow || line.mode !== "idle" || reacting || asleep) {
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
  }, [desktop, floating, narrow, line.mode, reacting, asleep]);

  function toggle() {
    if (desktop) {
      window.focusAPI?.sendMiniCommand(snapshot.running ? "pause" : "start");
      return;
    }
    if (snapshot.running) pause();
    else start();
  }

  function wake() {
    lastTouch.current = Date.now();
    setAsleep(false);
  }

  function onDragStart(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    wake();
    drag.current = { x: event.screenX, y: event.screenY, moved: false };
    setDragging(true);
    setAsleep(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onDragMove(event: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    const dx = event.screenX - drag.current.x;
    const dy = event.screenY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    drag.current = { x: event.screenX, y: event.screenY, moved: drag.current.moved };
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
    const clicked = Boolean(drag.current && !drag.current.moved);
    drag.current = null;
    setDragging(false);
    if (!clicked || line.mode !== "idle") return;
    setReacting(true);
    setAsleep(false);
    if (reactTimer.current) window.clearTimeout(reactTimer.current);
    reactTimer.current = window.setTimeout(() => setReacting(false), 1600);
  }

  function settleReminder(action: "done" | "snooze") {
    const id = line.reminderId;
    if (!id) return;
    if (action === "done") useReminderStore.getState().completeReminder(id);
    else useReminderStore.getState().snoozeReminder(id, 10);
    window.focusAPI?.syncReminders();
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
      : `pointer-events-none fixed bottom-4 z-30 w-[300px] ${spot.ready ? "" : "right-4"}`;

  return (
    <aside
      className={frameClass}
      style={!desktop && !floating && spot.ready ? { left: spot.left, right: "auto" } : undefined}
      aria-label="Screen companion"
      data-companion-root
      onPointerEnter={() => {
        wake();
        setHovering(true);
      }}
      onPointerLeave={() => setHovering(false)}
    >
      <div className={desktop || floating ? "flex h-full flex-col justify-end" : "pointer-events-auto"}>
        <div data-companion-hit className="relative rounded-2xl border border-white/10 bg-[#1b1f27] px-3 py-2 text-[#f4f4f5]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">{line.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">{line.body}</p>
          <p className="mt-2 font-semibold tabular-nums text-[#8AF6FF]">{clock(snapshot.remainingTime)}</p>
          {line.reminderId && (
            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => settleReminder("done")}
                className="rounded-full bg-[#7CFFD4] px-2.5 py-1 text-[11px] font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => settleReminder("snooze")}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Snooze
              </button>
            </div>
          )}
          <span className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-[#1b1f27]" />
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div
            data-companion-hit
            className={`${desktop || !floating ? "cursor-grab touch-none" : ""} ${
              scale === "small" ? "origin-bottom scale-[0.82]" : scale === "large" ? "origin-bottom scale-110" : ""
            }`}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <CompanionActor mode={pose} facing={facing} />
          </div>
          <CompanionControls
            running={snapshot.running}
            canFloat={canFloat}
            desktop={desktop}
            revealed={hovering}
            onOpenChange={setMenuOpen}
            onToggleTimer={toggle}
            onFloat={() => void floatOut()}
          />
        </div>
      </div>
    </aside>
  );
}
