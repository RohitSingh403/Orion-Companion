// src/components/sidebar/SidebarProfile.tsx

import { FaBrain } from "react-icons/fa";

export default function SidebarProfile() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-4
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-emerald-500
            text-xl
            text-white
          "
        >
          <FaBrain />
        </div>

        <div>
          <h3 className="font-semibold">
            Focus Companion
          </h3>

          <p className="text-sm text-zinc-400">
            Version 2.0 Development
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-3">
        <p className="text-xs text-zinc-500">
          Stay focused. Stay consistent.
        </p>
      </div>
    </div>
  );
}