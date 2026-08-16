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
    <aside className="w-64 h-screen bg-[#0f0f12] border-r border-white/6 flex flex-col justify-between p-4 flex-shrink-0 select-none">
      {/* Top Branding & Nav Section */}
      <div className="space-y-6">
        {/* App Logo & Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <HiSparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-primary tracking-tight leading-none">
                Focus Companion
              </h1>
              <p className="text-[10px] text-muted font-medium mt-0.5">
                Your all-in-one productivity OS
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
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
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/15 text-accent border border-accent/30 shadow-sm"
                    : "text-secondary hover:text-primary hover:bg-white/5 hover:translate-x-0.5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-accent" : "text-secondary"
                  }`}
                />
                <span className="transition-opacity duration-200">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-white/6">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition cursor-pointer">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-teal-400 flex items-center justify-center text-zinc-950 font-bold text-xs shadow">
              RS
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent border-2 border-[#0f0f12]"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-primary truncate">
              Rohit Singh
            </h4>
            <p className="text-[10px] text-muted truncate">
              rohit@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
