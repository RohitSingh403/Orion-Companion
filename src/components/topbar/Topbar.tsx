// src/components/topbar/Topbar.tsx

import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiBell } from "react-icons/fi";
import { useTaskStore } from "../../store/taskStore";
import { useSettingsStore } from "../../store/settingsStore";

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
  const theme = useSettingsStore((s) => s.theme);
  
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

  const isDark = theme === "dark";

  return (
    <header className={`w-full flex items-center justify-between px-8 py-4 border-b sticky top-0 z-30 select-none ${
    isDark 
      ? "bg-gray-900 border-gray-800" 
      : "bg-white border-gray-200"
  }`}>
      {/* Title & Subtitle */}
      <div>
        <h1 className={`text-xl font-semibold tracking-tight ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}>
          {displayGreeting}
        </h1>
        {propSubtitle && (
          <p className={`text-xs mt-0.5 ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}>{propSubtitle}</p>
        )}
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative flex items-center">
          <FiSearch className={`absolute left-3 w-3.5 h-3.5 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`} />
          <input
            type="text"
            placeholder="Search anything..."
            className={`w-56 h-9 pl-9 pr-8 rounded-lg text-sm ${
              isDark 
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-violet-500" 
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-violet-500"
            } border px-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all`}
          />
          <kbd className={`absolute right-2.5 px-1.5 py-0.5 text-[10px] font-medium rounded border ${
            isDark 
              ? "text-gray-500 bg-gray-800 border-gray-700" 
              : "text-gray-500 bg-gray-100 border-gray-300"
          }`}>
            ⌘K
          </kbd>
        </div>

        {/* Quick Add Task Button & Popover */}
        <div className="relative">
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="h-9 px-3.5 font-semibold text-sm rounded-lg flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Quick Add</span>
          </button>

          {quickAddOpen && (
            <div className={`absolute right-0 mt-2 w-72 p-3 shadow-xl z-50 rounded-lg border ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}>
              <form onSubmit={handleQuickAdd} className="space-y-2.5">
                <h4 className={`text-xs font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}>
                  Quick Add Task
                </h4>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  autoFocus
                  className={`w-full h-8 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-violet-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-violet-500"
                  } border`}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className={`px-2.5 py-1 text-sm font-medium transition-colors ${
                      isDark ? "text-gray-400 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm font-semibold rounded-md bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
          isDark 
            ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}>
          <FiBell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"></span>
        </button>

        {/* User Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
          isDark 
            ? "bg-gradient-to-tr from-violet-500 to-pink-500 text-white" 
            : "bg-gradient-to-tr from-violet-600 to-pink-600 text-white"
        }`}>
          RS
        </div>
      </div>
    </header>
  );
}
