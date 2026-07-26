// src/components/sidebar/SidebarItem.tsx

import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

export default function SidebarItem({
  icon,
  label,
  to,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-left
          transition-all
          duration-200
          ${
            isActive
              ? "bg-emerald-500 text-white shadow-lg"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }
        `
      }
    >
      <span className="text-xl">{icon}</span>

      <span className="font-medium">{label}</span>
    </NavLink>
  );
}