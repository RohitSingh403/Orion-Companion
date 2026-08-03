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
          duration-300
          relative
          overflow-hidden
          ${
            isActive
              ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white hover:border hover:border-zinc-700/50"
          }
        `
      }
    >
      <span className="text-xl relative z-10">{icon}</span>

      <span className="font-medium relative z-10">{label}</span>
    </NavLink>
  );
}