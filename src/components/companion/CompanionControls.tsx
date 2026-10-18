import { useEffect, useId, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useSettingsStore, type CompanionScale } from "../../store/settingsStore";

const SCALES: Array<{ id: CompanionScale; label: string }> = [
  { id: "small", label: "S" },
  { id: "medium", label: "M" },
  { id: "large", label: "L" },
];

export default function CompanionControls({
  running,
  canFloat,
  desktop,
  revealed,
  onOpenChange,
  onToggleTimer,
  onFloat,
}: {
  running: boolean;
  canFloat: boolean;
  desktop: boolean;
  revealed: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTimer: () => void;
  onFloat: () => void;
}) {
  const scale = useSettingsStore((state) => state.companionScale);
  const setScale = useSettingsStore((state) => state.setCompanionScale);
  const [pinned, setPinned] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const open = revealed || pinned || focused;

  useEffect(() => {
    onOpenChange(open);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!pinned) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPinned(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPinned(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [pinned]);

  const hide = () => {
    if (window.focusAPI) window.focusAPI.setCompanionVisible(false);
    else useSettingsStore.getState().setCompanionEnabled(false);
    setPinned(false);
  };

  const itemClass =
    "w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-zinc-100 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]";

  return (
    <div
      data-companion-hit
      ref={rootRef}
      className="relative mb-2"
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Companion options"
        onClick={() => setPinned((value) => !value)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#1b1f27]/95 text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
      >
        <FiMoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Companion options"
          className="absolute bottom-10 right-0 z-40 w-44 rounded-2xl border border-white/10 bg-[#20242d] p-1.5 shadow-2xl"
        >
          <button type="button" role="menuitem" className={itemClass} onClick={onToggleTimer}>
            {running ? "Hold timer" : "Begin timer"}
          </button>
          {canFloat ? (
            <button type="button" role="menuitem" className={itemClass} onClick={onFloat}>
              Float
            </button>
          ) : null}
          {desktop ? (
            <button type="button" role="menuitem" className={itemClass} onClick={() => window.focusAPI?.showMainWindow()}>
              Open app
            </button>
          ) : null}
          <div className="my-1 px-2" role="group" aria-label="Companion size">
            <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Size</p>
            <div className="flex gap-1">
              {SCALES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={scale === option.id}
                  onClick={() => setScale(option.id)}
                  className={`h-7 flex-1 rounded-lg text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                    scale === option.id ? "bg-[#7CFFD4] text-[#14161c]" : "bg-white/5 text-zinc-200"
                  }`}
                >
                  {option.label}
                  <span className="sr-only">{option.id}</span>
                </button>
              ))}
            </div>
          </div>
          <button type="button" role="menuitem" className={itemClass} onClick={hide}>
            Hide companion
          </button>
          {desktop ? (
            <button
              type="button"
              role="menuitem"
              className="w-full rounded-xl px-3 py-2 text-left text-xs text-zinc-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              onClick={() => window.focusAPI?.exitCompanion()}
            >
              Exit Orion
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
