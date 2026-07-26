// src/components/sidebar/SidebarItem.tsx

import type { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
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
          active
            ? "bg-emerald-500 text-white shadow-lg"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }
      `}
    >
      <span className="text-xl">{icon}</span>

      <span className="font-medium">{label}</span>
    </button>
  );
}