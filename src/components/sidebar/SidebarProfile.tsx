// src/components/sidebar/SidebarProfile.tsx

import { FaBrain } from "react-icons/fa";

export default function SidebarProfile() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-white">
          <FaBrain />
        </div>

        <div>
          <h3 className="font-semibold text-primary">
            Focus Companion
          </h3>

          <p className="text-sm text-secondary">
            Version 2.0 Development
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs text-muted">
          Stay focused. Stay consistent.
        </p>
      </div>
    </div>
  );
}