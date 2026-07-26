// src/components/sidebar/Sidebar.tsx

import {
  FaHome,
  FaBullseye,
  FaCheckSquare,
  FaStickyNote,
  FaChartBar,
  FaTrophy,
  FaCog,
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
        border-zinc-800
        bg-zinc-900
        px-5
        py-6
      "
    >
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          🧠 Focus Companion
        </h1>

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
          to="/settings"
          icon={<FaCog />}
          label="Settings"
        />
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 pt-5">
        <p className="text-xs text-zinc-500">
          Focus Companion
        </p>

        <p className="text-xs text-zinc-600">
          Version 2.0 Development
        </p>
      </div>
    </aside>
  );
}