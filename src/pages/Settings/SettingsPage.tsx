// src/pages/Settings/SettingsPage.tsx

import { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import PageHeading from "../../components/shell/PageHeading";
import { useFocusStore } from "../../store/focusStore";
import { useSettingsStore } from "../../store/settingsStore";
import { exportBackup, importBackup } from "../../utils/backup";
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
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

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
    displayName,
    setDisplayName,
    companionEnabled,
    setCompanionEnabled,
  } = useSettingsStore();

  const { setFocusDuration, setBreakDuration, setDailyGoal: setFocusDailyGoal, resetAllData } = useFocusStore();

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
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-violet-400 border-gray-700" : "text-violet-600 border-gray-200"}`}>
        Focus & Timer Configuration
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Focus Duration */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}>Focus Duration (minutes)</label>
          <select
            value={focusMinutes}
            onChange={(e) => {
              const minutes = Number(e.target.value);
              setFocusMinutes(minutes);
              setFocusDuration(minutes);
            }}
            className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
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
          <label className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}>Short Break (minutes)</label>
          <select
            value={breakMinutes}
            onChange={(e) => {
              const minutes = Number(e.target.value);
              setBreakMinutes(minutes);
              setBreakDuration(minutes);
            }}
            className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
          >
            <option value={3}>3 minutes</option>
            <option value={5}>5 minutes (Standard)</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
        </div>

        {/* Daily Goal */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}>Daily Session Goal</label>
          <select
            value={dailyGoal}
            onChange={(e) => {
              const goal = Number(e.target.value);
              setDailyGoal(goal);
              setFocusDailyGoal(goal);
            }}
            className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
          >
            <option value={4}>4 sessions</option>
            <option value={6}>6 sessions</option>
            <option value={8}>8 sessions (Recommended)</option>
            <option value={10}>10 sessions</option>
            <option value={12}>12 sessions</option>
          </select>
        </div>
      </div>

      <div className={`space-y-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        {/* Auto Start Break Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Auto-start Breaks</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Automatically start break timer when focus ends</p>
          </div>
          <button
            onClick={() => setAutoStartBreak(!autoStartBreak)}
            className={`toggle ${autoStartBreak ? "active" : ""}`}
          >
          </button>
        </div>

        {/* Auto Start Focus Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Auto-start Focus</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Automatically start next focus session when break ends</p>
          </div>
          <button
            onClick={() => setAutoStartFocus(!autoStartFocus)}
            className={`toggle ${autoStartFocus ? "active" : ""}`}
          >
          </button>
        </div>
      </div>
    </div>
  );

  const renderSoundSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-violet-400 border-gray-700" : "text-violet-600 border-gray-200"}`}>
        Sound Configuration
      </h3>

      <div className="space-y-4">
        {/* Sound Enabled Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Enable Sounds</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Play audio cues on timer transitions</p>
          </div>
          <button
            onClick={toggleSound}
            className={`toggle ${soundEnabled ? "active" : ""}`}
          >
          </button>
        </div>

        {/* Break Sound Select */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}>Break Start Sound</label>
          <select
            value={breakSound}
            onChange={(e) => setBreakSound(e.target.value)}
            disabled={!soundEnabled}
            className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
          >
            <option value="break.mp3">Default Chime</option>
            <option value="bell.mp3">Bell</option>
            <option value="gentle.mp3">Gentle Tone</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Focus Sound Select */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}>Focus Start Sound</label>
          <select
            value={focusSound}
            onChange={(e) => setFocusSound(e.target.value)}
            disabled={!soundEnabled}
            className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
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
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-violet-400 border-gray-700" : "text-violet-600 border-gray-200"}`}>
        Notification Settings
      </h3>

      <div className="space-y-4">
        {/* Desktop Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Desktop Notifications</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Show system notifications on timer events</p>
          </div>
          <button
            onClick={() => setDesktopNotifications(!desktopNotifications)}
            className={`toggle ${desktopNotifications ? "active" : ""}`}
          >
          </button>
        </div>

        {/* Break Reminder Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Break Reminder</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Remind you to take breaks during long sessions</p>
          </div>
          <button
            onClick={() => setBreakReminder(!breakReminder)}
            className={`toggle ${breakReminder ? "active" : ""}`}
          >
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-violet-400 border-gray-700" : "text-violet-600 border-gray-200"}`}>
        Appearance Settings
      </h3>

      <div className="space-y-4">
        {/* Theme Select */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-600"}`}>Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "dark" | "light")}
            className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
          >
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
          </select>
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Light mode changes the inner pages. The dashboard stays in the dark workspace.</p>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-violet-400 border-gray-700" : "text-violet-600 border-gray-200"}`}>
        General Settings
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`} htmlFor="display-name">
            Name on this computer
          </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 ${
              isDark ? "border-white/10 bg-[#1b1f27] text-gray-100" : "border-gray-300 bg-white text-gray-900"
            }`}
          />
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Shown on the dashboard and the sidebar. Orion does not create an account.
          </p>
        </div>
        {/* Auto Launch Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Auto Launch on Startup</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Start Focus Companion automatically when your computer starts</p>
          </div>
          <button
            onClick={handleToggleAutoLaunch}
            className={`toggle ${autoLaunchEnabled ? "active" : ""}`}
          >
          </button>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-violet-400 border-gray-700" : "text-violet-600 border-gray-200"}`}>
        Data & Backup
      </h3>

      <div className="space-y-4">
        {/* Reset Stats */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${
          isDark 
            ? "bg-red-500/5 border-red-500/20" 
            : "bg-red-50 border-red-200"
        }`}>
          <div>
            <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Reset All Stats</h4>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Clear all focus sessions, history, streaks, and daily statistics</p>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset all stats? This cannot be undone.")) {
                resetAllData();
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" 
                : "bg-red-100 text-red-600 border border-red-200 hover:bg-red-200"
            }`}
          >
            Reset Stats
          </button>
        </div>

        <div className={`rounded-lg border p-4 ${isDark ? "border-white/10 bg-[#1b1f27]" : "border-gray-200 bg-white"}`}>
          <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Export backup</h4>
          <p className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Download tasks, notes, sessions, reminders, and settings as a JSON file stored on this computer.
          </p>
          <button
            type="button"
            onClick={exportBackup}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14161c]"
          >
            Download backup
          </button>
        </div>
        <div className={`rounded-lg border p-4 ${isDark ? "border-white/10 bg-[#1b1f27]" : "border-gray-200 bg-white"}`}>
          <h4 className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Import backup</h4>
          <p className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Replace the data on this computer with a backup file. The page reloads after a valid import.
          </p>
          <input
            type="file"
            accept="application/json"
            className="mt-3 block text-sm text-zinc-300"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const result = importBackup(String(reader.result ?? ""));
                if (!result.ok) window.alert(result.message);
              };
              reader.readAsText(file);
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? "text-zinc-200 border-white/10" : "text-gray-900 border-gray-200"}`}>
        Desktop
      </h3>
      <div className="space-y-3 text-sm text-zinc-400">
        <p>Closing the window keeps Orion in the tray. Quit from the tray menu.</p>
        <p>Press Ctrl+Shift+Space, or Cmd+Shift+Space on Mac, to open quick add.</p>
        <p>The tray menu can open a small always-on-top timer. That window follows the main timer.</p>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1b1f27] px-4 py-3">
          <div>
            <h4 className="text-sm font-medium text-zinc-100">Screen companion</h4>
            <p className="mt-1 text-xs text-zinc-500">The character stays on the desktop after this window closes. It types during a focus block and drinks coffee on a break. Drag the character. Hide it from the character or the tray.</p>
          </div>
          <button
            type="button"
            aria-pressed={companionEnabled}
            onClick={() => setCompanionEnabled(!companionEnabled)}
            className={`toggle ${companionEnabled ? "active" : ""}`}
          />
        </div>
        <p>While a desktop focus session is running, the app in front is recorded every 15 seconds and shown on the dashboard. The browser does not record apps.</p>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <PageHeading title="Settings" subtitle="Timer, sound, backup, and this computer" />
      <div className="flex gap-6 px-4 pb-6 md:px-6">
        {/* Left Sub-Sidebar */}
        <div className={`w-64 rounded-lg p-4 flex flex-col gap-1 flex-shrink-0 border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Panel */}
        <div className={`flex-1 rounded-lg p-6 overflow-y-auto no-scrollbar border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {activeTab === "focus" && renderFocusSettings()}
          {activeTab === "sounds" && renderSoundSettings()}
          {activeTab === "notifications" && renderNotificationSettings()}
          {activeTab === "appearance" && renderAppearanceSettings()}
          {activeTab === "general" && renderGeneralSettings()}
          {activeTab === "data" && renderDataSettings()}
          {activeTab === "advanced" && renderAdvancedSettings()}
        </div>
      </div>
    </AppLayout>
  );
}
