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
          rounded-lg
          px-3
          py-2
          text-left
          transition-all
          duration-200
          ${
            isActive
              ? "bg-white/10 text-white"
              : "text-secondary hover:bg-white/5 hover:text-white"
          }
        `
      }
    >
      <span className="text-lg">{icon}</span>

      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
}