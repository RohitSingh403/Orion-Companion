// src/components/topbar/Topbar.tsx

import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiBell } from "react-icons/fi";
import { useTaskStore } from "../../store/taskStore";

interface TopbarProps {
  greeting?: string;
  subtitle?: string;
}

export default function Topbar({
  greeting: propGreeting,
  subtitle: propSubtitle,
}: TopbarProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  
  // Initialize greeting immediately based on current time
  const getInitialGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    
    if (hour >= 12 && hour < 17) {
      greeting = "Good Afternoon";
    } else if (hour >= 17) {
      greeting = "Good Evening";
    }
    
    return `${greeting}, Rohit 👋`;
  };
  
  const [dynamicGreeting, setDynamicGreeting] = useState(getInitialGreeting());
  const addTask = useTaskStore((s) => s.addTask);

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greeting = "Good Morning";

      if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
      } else if (hour >= 17) {
        greeting = "Good Evening";
      }

      setDynamicGreeting(`${greeting}, Rohit 👋`);
    };

    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Initialize greeting immediately on mount
  const displayGreeting = propGreeting || dynamicGreeting;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({ title: taskTitle });
    setTaskTitle("");
    setQuickAddOpen(false);
  };

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-white/6 bg-white/[0.02] sticky top-0 z-30 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-semibold text-primary tracking-tight">
          {displayGreeting}
        </h1>
        {propSubtitle && (
          <p className="text-xs text-secondary mt-0.5">{propSubtitle}</p>
        )}
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-56 h-9 pl-9 pr-8 input rounded-lg text-sm text-primary placeholder-muted"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-medium text-muted bg-white/5 border border-white/10 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Quick Add Task Button & Popover */}
        <div className="relative">
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="h-9 px-3.5 btn-primary font-medium text-sm rounded-lg flex items-center gap-1.5"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Add</span>
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-2 w-72 p-3 bg-[#1a1a1e] border border-white/20 shadow-2xl z-50 rounded-lg">
              <form onSubmit={handleQuickAdd} className="space-y-2.5">
                <h4 className="text-xs font-semibold text-primary">
                  Quick Add Task
                </h4>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  autoFocus
                  className="w-full h-8 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-primary placeholder-muted focus:border-accent/50 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className="px-2.5 py-1 text-sm text-secondary hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 btn-primary text-sm font-medium rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="icon-btn relative">
          <FiBell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"></span>
        </button>

        {/* User Avatar */}
        <div className="avatar">
          RS
        </div>
      </div>
    </header>
  );
}
