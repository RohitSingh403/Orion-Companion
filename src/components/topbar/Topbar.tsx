// src/components/topbar/Topbar.tsx

import { useState } from "react";
import { FiSearch, FiPlus, FiBell } from "react-icons/fi";
import { useTaskStore } from "../../store/taskStore";

interface TopbarProps {
  greeting?: string;
  subtitle?: string;
}

export default function Topbar({
  greeting = "Good Morning, Rohit 👋",
  subtitle = "Let's make today productive!",
}: TopbarProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const addTask = useTaskStore((s) => s.addTask);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({ title: taskTitle });
    setTaskTitle("");
    setQuickAddOpen(false);
  };

  return (
    <header className="w-full flex items-center justify-between px-8 py-5 border-b border-zinc-800/50 glass-card sticky top-0 z-30 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-gradient-emerald tracking-tight">
          {greeting}
        </h1>
        {subtitle && (
          <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-56 h-9 pl-9 pr-8 input-premium rounded-xl text-xs text-zinc-200 placeholder-zinc-500 transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 rounded badge-premium">
            ⌘K
          </kbd>
        </div>

        {/* Quick Add Task Button & Popover */}
        <div className="relative">
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="h-9 px-3.5 btn-premium text-zinc-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Add</span>
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-2 w-72 p-3 glass-card rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 border-gradient">
              <form onSubmit={handleQuickAdd} className="space-y-2.5">
                <h4 className="text-xs font-semibold text-zinc-300">
                  Quick Add Task
                </h4>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  autoFocus
                  className="w-full h-8 px-3 input-premium rounded-lg text-xs text-zinc-200 transition-all"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className="px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 btn-premium text-zinc-950 text-xs font-semibold rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-emerald-500/30 transition-all relative">
          <FiBell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 glow-emerald"></span>
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border border-emerald-500/40 flex items-center justify-center text-zinc-950 font-bold text-xs shadow-lg glow-emerald">
          RS
        </div>
      </div>
    </header>
  );
}
