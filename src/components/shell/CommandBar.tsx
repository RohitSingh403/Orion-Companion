import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiChevronDown, FiEye, FiEyeOff, FiPlay, FiPlus, FiPower, FiSquare, FiVolume2 } from "react-icons/fi";
import { useFocusStore } from "../../store/focusStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTaskStore } from "../../store/taskStore";
import { formatClock } from "../../utils/activity";
import CommandSearch from "./CommandSearch";
import { useAmbient, type AmbientScene } from "./useAmbient";

const SCENES: AmbientScene[] = ["Coffee Shop", "Rain", "Night"];

export default function CommandBar() {
  const session = useFocusStore((state) => state.session);
  const remainingTime = useFocusStore((state) => state.remainingTime);
  const running = useFocusStore((state) => state.running);
  const start = useFocusStore((state) => state.start);
  const pause = useFocusStore((state) => state.pause);
  const reset = useFocusStore((state) => state.reset);
  const ambient = useAmbient();
  const addTask = useTaskStore((state) => state.addTask);
  const companionEnabled = useSettingsStore((state) => state.companionEnabled);
  const setCompanionEnabled = useSettingsStore((state) => state.setCompanionEnabled);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const openQuickAdd = () => setQuickAddOpen(true);
    window.addEventListener("orion-quick-add", openQuickAdd);
    return () => window.removeEventListener("orion-quick-add", openQuickAdd);
  }, []);

  useEffect(() => {
    if (!quickAddOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!quickAddRef.current?.contains(event.target as Node)) setQuickAddOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [quickAddOpen]);

  const saveQuickAdd = (event: FormEvent) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({ title: taskTitle });
    setTaskTitle("");
    setQuickAddOpen(false);
  };

  const status = session === "focus" ? "Focus Time Remaining" : "Break Time Remaining";
  const accent = session === "focus" ? "text-[#8AF6FF]" : "text-[#60A5FA]";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 pb-2 pt-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={running ? pause : start}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1c212b] text-zinc-200 transition hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label={running ? "Pause session" : "Start session"}
        >
          <FiPower className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1c212b] px-3 py-2" aria-label={`${formatClock(remainingTime)} ${status}`}>
          <span className={`text-sm ${accent}`} aria-hidden="true">
            {session === "focus" ? "◷" : "◌"}
          </span>
          <span className="font-mono text-sm font-semibold text-white">{formatClock(remainingTime)}</span>
          <span className="text-xs text-zinc-400">{status}</span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#1c212b] px-4 text-xs font-medium text-zinc-200 transition hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            End Focus
            <FiChevronDown className="h-3.5 w-3.5" />
          </button>
          {menuOpen ? (
            <div role="menu" className="absolute left-0 z-20 mt-2 w-44 rounded-2xl border border-white/10 bg-[#20242d] p-1.5 shadow-2xl">
              <button
                type="button"
                role="menuitem"
                className="w-full rounded-xl px-3 py-2 text-left text-xs text-zinc-200 hover:bg-white/5"
                onClick={() => {
                  if (running) pause();
                  else start();
                  setMenuOpen(false);
                }}
              >
                {running ? "Pause session" : "Resume session"}
              </button>
              <button
                type="button"
                role="menuitem"
                className="w-full rounded-xl px-3 py-2 text-left text-xs text-rose-300 hover:bg-white/5"
                onClick={() => {
                  reset();
                  setMenuOpen(false);
                }}
              >
                End and reset
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <CommandSearch />

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-pressed={companionEnabled}
          onClick={() => setCompanionEnabled(!companionEnabled)}
          className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-[#1c212b] px-3 text-xs font-semibold text-zinc-100 hover:bg-[#262b36] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {companionEnabled ? <FiEyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <FiEye className="h-3.5 w-3.5" aria-hidden="true" />}
          {companionEnabled ? "Hide companion" : "Show companion"}
        </button>
        <div className="relative" ref={quickAddRef}>
          <button
            type="button"
            onClick={() => setQuickAddOpen((open) => !open)}
            className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-[#1c212b] px-3.5 text-sm font-semibold text-zinc-100 hover:bg-[#262b36] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <FiPlus className="h-4 w-4" />
            Quick Add
          </button>
          {quickAddOpen ? (
            <form onSubmit={saveQuickAdd} className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-white/10 bg-[#20242d] p-3 shadow-2xl">
              <h2 className="text-xs font-semibold text-zinc-100">Quick add task</h2>
              <input
                type="text"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Task title"
                autoFocus
                className="mt-2 h-9 w-full rounded-xl border border-white/10 bg-[#121418] px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setQuickAddOpen(false)} className="px-2 py-1 text-sm text-zinc-400">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#14161c]">
                  Save
                </button>
              </div>
            </form>
          ) : null}
        </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1c212b] px-2 py-1.5">
        <label className="sr-only" htmlFor="ambient-scene">
          Ambient scene
        </label>
        <select
          id="ambient-scene"
          value={ambient.scene}
          onChange={(event) => ambient.setScene(event.target.value as AmbientScene)}
          className="bg-transparent px-2 text-xs text-zinc-200 focus:outline-none"
        >
          {SCENES.map((item) => (
            <option key={item} value={item} className="bg-[#1c212b]">
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => ambient.setPlaying(!ambient.playing)}
          disabled={!ambient.soundEnabled}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#14161c] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label={ambient.playing ? "Pause ambient sound" : "Play ambient sound"}
        >
          {ambient.playing ? <FiSquare className="h-3 w-3" /> : <FiPlay className="ml-0.5 h-3 w-3" />}
        </button>
        <FiVolume2 className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
        <label className="sr-only" htmlFor="ambient-volume">
          Ambient volume
        </label>
        <input
          id="ambient-volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={ambient.volume}
          onChange={(event) => ambient.setVolume(Number(event.target.value))}
          className="h-1 w-16 accent-zinc-300"
        />
      </div>
      </div>
    </header>
  );
}
