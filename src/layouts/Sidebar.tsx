// src/layouts/Sidebar.tsx

import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiTarget,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiBarChart2,
  FiAward,
  FiSettings,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useSettingsStore } from "../store/settingsStore";

export default function Sidebar() {
  const location = useLocation();
  const theme = useSettingsStore((s) => s.theme);

  const navItems = [
    { label: "Dashboard", path: "/", icon: FiGrid },
    { label: "Focus", path: "/focus", icon: FiTarget },
    { label: "Workspace", path: "/tasks", icon: FiBriefcase },
    { label: "Calendar", path: "/calendar", icon: FiCalendar },
    { label: "Notes", path: "/notes", icon: FiFileText },
    { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
    { label: "Achievements", path: "/achievements", icon: FiAward },
    { label: "Settings", path: "/settings", icon: FiSettings },
  ];

  const isDark = theme === "dark";

  return (
    <aside className={`w-64 h-screen flex flex-col justify-between p-4 flex-shrink-0 select-none border-r ${
      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    }`}>
      {/* Top Branding & Nav Section */}
      <div className="space-y-6">
        {/* App Logo & Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDark ? "bg-violet-500/10 border border-violet-500/30 text-violet-400" : "bg-violet-50 border border-violet-200 text-violet-600"
            }`}>
              <HiSparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`font-bold text-sm tracking-tight leading-none ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                Focus Companion
              </h1>
              <p className={`text-[10px] font-medium mt-0.5 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}>
                Your all-in-one productivity OS
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDark 
              ? "bg-gradient-to-r from-violet-500/10 to-pink-500/10 text-violet-400 border-violet-500/20" 
              : "bg-gradient-to-r from-violet-50 to-pink-50 text-violet-600 border-violet-200"
          }`}>
            v2.0
          </span>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main navigation" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                  isActive
                    ? isDark
                      ? "bg-gradient-to-r from-violet-500/15 to-pink-500/15 text-violet-400 border border-violet-500/30 shadow-glow"
                      : "bg-gradient-to-r from-violet-50 to-pink-50 text-violet-600 border border-violet-200 shadow-lg"
                    : isDark
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  className={`w-4 h-4 ${
                    isActive ? "text-violet-500" : ""
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className={`pt-4 border-t ${
        isDark ? "border-gray-800" : "border-gray-200"
      }`}>
        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition cursor-pointer ${
          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
        }`}>
          <div className="relative">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
              isDark 
                ? "bg-gradient-to-tr from-violet-500 to-pink-500 text-white" 
                : "bg-gradient-to-tr from-violet-600 to-pink-600 text-white"
            }`}>
              RS
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
              isDark ? "bg-green-500 border-gray-900" : "bg-green-500 border-white"
            }`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs font-semibold truncate ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              Rohit Singh
            </h4>
            <p className={`text-[10px] truncate ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}>
              rohit@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
