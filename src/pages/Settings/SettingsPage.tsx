// src/pages/Settings/SettingsPage.tsx

import { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useSettingsStore } from "../../store/settingsStore";
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
  const [activeTab, setActiveTab] = useState("general");
  const [autoLaunchEnabled, setAutoLaunchEnabled] = useState(false);

  const {
    focusMinutes,
    breakMinutes,
    dailyGoal,
    autoStartBreak,
    autoStartFocus,
    soundEnabled,
    breakSound,
    focusSound,
    desktopNotifications,
    breakReminder,
    theme,
    setFocusMinutes,
    setBreakMinutes,
    setDailyGoal,
    setAutoStartBreak,
    setAutoStartFocus,
    toggleSound,
    setBreakSound,
    setFocusSound,
    setDesktopNotifications,
    setBreakReminder,
    setTheme,
  } = useSettingsStore();

  // Load auto-launch status on mount
  useEffect(() => {
    const loadAutoLaunchStatus = async () => {
      try {
        const status = await window.focusAPI?.getAutoLaunchStatus();
        setAutoLaunchEnabled(status || false);
      } catch (error) {
        console.error("Failed to load auto-launch status:", error);
      }
    };
    loadAutoLaunchStatus();
  }, []);

  const handleToggleAutoLaunch = async () => {
    try {
      const newStatus = await window.focusAPI?.toggleAutoLaunch(!autoLaunchEnabled);
      setAutoLaunchEnabled(newStatus || false);
    } catch (error) {
      console.error("Failed to toggle auto-launch:", error);
    }
  };

  const navItems = [
    { id: "focus", label: "Focus Settings", icon: FiClock },
    { id: "sounds", label: "Sounds", icon: FiVolume2 },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "appearance", label: "Appearance", icon: FiEye },
    { id: "general", label: "General", icon: FiSliders },
    { id: "data", label: "Data & Backup", icon: FiDatabase },
    { id: "advanced", label: "Advanced", icon: FiShield },
  ];

  const renderFocusSettings = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
        Focus & Timer Configuration
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Focus Duration */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">Focus Duration (minutes)</label>
          <select
            value={focusMinutes}
            onChange={(e) => setFocusMinutes(Number(e.target.value))}
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
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
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
  );

  const renderSoundSettings = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
        Sound Configuration
      </h3>

      <div className="space-y-4">
        {/* Sound Enabled Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Enable Sounds</h4>
            <p className="text-[10px] text-zinc-500">Play audio cues on timer transitions</p>
          </div>
          <button
            onClick={toggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              soundEnabled ? "bg-emerald-500" : "bg-zinc-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                soundEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Break Sound Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">Break Start Sound</label>
          <select
            value={breakSound}
            onChange={(e) => setBreakSound(e.target.value)}
            disabled={!soundEnabled}
            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="break.mp3">Default Chime</option>
            <option value="bell.mp3">Bell</option>
            <option value="gentle.mp3">Gentle Tone</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Focus Sound Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">Focus Start Sound</label>
          <select
            value={focusSound}
            onChange={(e) => setFocusSound(e.target.value)}
            disabled={!soundEnabled}
            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="complete.mp3">Complete Chime</option>
            <option value="motivation.mp3">Motivation</option>
            <option value="subtle.mp3">Subtle Tone</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
        Notification Settings
      </h3>

      <div className="space-y-4">
        {/* Desktop Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Desktop Notifications</h4>
            <p className="text-[10px] text-zinc-500">Show system notifications on timer events</p>
          </div>
          <button
            onClick={() => setDesktopNotifications(!desktopNotifications)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              desktopNotifications ? "bg-emerald-500" : "bg-zinc-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                desktopNotifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Break Reminder Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Break Reminder</h4>
            <p className="text-[10px] text-zinc-500">Remind you to take breaks during long sessions</p>
          </div>
          <button
            onClick={() => setBreakReminder(!breakReminder)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              breakReminder ? "bg-emerald-500" : "bg-zinc-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                breakReminder ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
        Appearance Settings
      </h3>

      <div className="space-y-4">
        {/* Theme Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "dark" | "light")}
            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
          </select>
          <p className="text-[10px] text-zinc-500">Light mode coming soon</p>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
        General Settings
      </h3>

      <div className="space-y-4">
        {/* Auto Launch Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Auto Launch on Startup</h4>
            <p className="text-[10px] text-zinc-500">Start Focus Companion automatically when your computer starts</p>
          </div>
          <button
            onClick={handleToggleAutoLaunch}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              autoLaunchEnabled ? "bg-emerald-500" : "bg-zinc-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                autoLaunchEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800">
        {title}
      </h3>
      <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
        <p className="text-xs text-zinc-500">This section is coming soon.</p>
      </div>
    </div>
  );

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
        <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto no-scrollbar">
          {activeTab === "focus" && renderFocusSettings()}
          {activeTab === "sounds" && renderSoundSettings()}
          {activeTab === "notifications" && renderNotificationSettings()}
          {activeTab === "appearance" && renderAppearanceSettings()}
          {activeTab === "general" && renderGeneralSettings()}
          {activeTab === "data" && renderPlaceholder("Data & Backup")}
          {activeTab === "advanced" && renderPlaceholder("Advanced Settings")}
        </div>
      </div>
    </AppLayout>
  );
}
