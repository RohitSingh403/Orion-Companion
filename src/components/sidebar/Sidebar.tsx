// src/components/sidebar/Sidebar.tsx

import {
  FaHome,
  FaBullseye,
  FaCheckSquare,
  FaStickyNote,
  FaChartBar,
  FaTrophy,
  FaCog,
  FaCalendarAlt,
  FaBell,
  FaRobot,
} from "react-icons/fa";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside
      className="
        flex
        h-screen
        w-72
        flex-col
        border-r
        border-zinc-800/50
        glass-card
        px-5
        py-6
      "
    >
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="/src/assets/icons/Orion Companion Logo.png" 
            alt="Orion Companion Logo" 
            className="w-10 h-10 rounded-lg object-contain"
          />
          <h1 className="text-2xl font-bold text-gradient-emerald">
            Orion Companion
          </h1>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          Productivity Workspace
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        <SidebarItem
          to="/"
          icon={<FaHome />}
          label="Dashboard"
        />

        <SidebarItem
          to="/focus"
          icon={<FaBullseye />}
          label="Focus"
        />

        <SidebarItem
          to="/tasks"
          icon={<FaCheckSquare />}
          label="Tasks"
        />

        <SidebarItem
          to="/calendar"
          icon={<FaCalendarAlt />}
          label="Calendar"
        />

        <SidebarItem
          to="/notes"
          icon={<FaStickyNote />}
          label="Notes"
        />

        <SidebarItem
          to="/analytics"
          icon={<FaChartBar />}
          label="Analytics"
        />

        <SidebarItem
          to="/achievements"
          icon={<FaTrophy />}
          label="Achievements"
        />

        <SidebarItem
          to="/reminders"
          icon={<FaBell />}
          label="Reminders"
        />

        <SidebarItem
          to="/ai-companion"
          icon={<FaRobot />}
          label="AI Companion"
        />

        <SidebarItem
          to="/settings"
          icon={<FaCog />}
          label="Settings"
        />
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800/50 pt-5">
        <p className="text-xs text-zinc-500">
          Orion Companion
        </p>

        <p className="text-xs text-zinc-600">
          Version 1.0.0 Production
        </p>
      </div>
    </aside>
  );
}