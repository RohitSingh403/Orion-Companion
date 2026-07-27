// src/pages/Settings/SettingsPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useFocusStore } from "../../store/focusStore";
import {
  FiSliders,
  FiEye,
  FiClock,
  FiBell,
  FiVolume2,
  FiDatabase,
  FiShield,
} from "react-icons/fi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("focus");

  const {
    focusDuration,
    breakDuration,
    setFocusDuration,
    setBreakDuration,
    setDailyGoal,
    dailyGoal,
  } = useFocusStore();

  const [autoStartBreak, setAutoStartBreak] = useState(true);
  const [autoStartFocus, setAutoStartFocus] = useState(false);

  const navItems = [
    { id: "general", label: "General", icon: FiSliders },
    { id: "appearance", label: "Appearance", icon: FiEye },
    { id: "focus", label: "Focus Settings", icon: FiClock },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "sounds", label: "Sounds", icon: FiVolume2 },
    { id: "data", label: "Data & Backup", icon: FiDatabase },
    { id: "advanced", label: "Advanced", icon: FiShield },
  ];

  return (
    <AppLayout>
      <Topbar greeting="Settings ⚙️" subtitle="Configure focus timer, sound cues & app preferences" />
      <div className="flex-1 overflow-hidden p-8 flex gap-6">
        {/* Left Sub-Sidebar */}
        <div className="w-64 glass-card rounded-2xl p-4 flex flex-col gap-1 flex-shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Panel */}
        <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto space-y-6 no-scrollbar">
          <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
            Focus & Timer Configuration
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Focus Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Focus Duration (minutes)</label>
              <select
                value={Math.floor(focusDuration / 60)}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes (Standard)</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            {/* Break Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Short Break (minutes)</label>
              <select
                value={Math.floor(breakDuration / 60)}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes (Standard)</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </div>

            {/* Daily Goal */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Daily Session Goal</label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value={4}>4 sessions</option>
                <option value={6}>6 sessions</option>
                <option value={8}>8 sessions (Recommended)</option>
                <option value={10}>10 sessions</option>
                <option value={12}>12 sessions</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            {/* Auto Start Break Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Auto-start Breaks</h4>
                <p className="text-[10px] text-zinc-500">Automatically start break timer when focus ends</p>
              </div>
              <button
                onClick={() => setAutoStartBreak(!autoStartBreak)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoStartBreak ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                    autoStartBreak ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Auto Start Focus Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Auto-start Focus</h4>
                <p className="text-[10px] text-zinc-500">Automatically start next focus session when break ends</p>
              </div>
              <button
                onClick={() => setAutoStartFocus(!autoStartFocus)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoStartFocus ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                    autoStartFocus ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
