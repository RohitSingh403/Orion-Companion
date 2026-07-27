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

export default function Sidebar() {
  const location = useLocation();

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

  return (
    <aside className="w-64 h-screen bg-[#0f0f12] border-r border-zinc-800/80 flex flex-col justify-between p-4 flex-shrink-0 select-none">
      {/* Top Branding & Nav Section */}
      <div className="space-y-6">
        {/* App Logo & Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-emerald">
              <HiSparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-zinc-100 tracking-tight leading-none">
                Focus Companion
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Your all-in-one productivity OS
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            v2.0
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-emerald-400" : "text-zinc-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-zinc-800/80">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-zinc-800/40 transition cursor-pointer">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-bold text-xs shadow">
              RS
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0f0f12]"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-zinc-200 truncate">
              Rohit Singh
            </h4>
            <p className="text-[10px] text-zinc-500 truncate">
              rohit@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
