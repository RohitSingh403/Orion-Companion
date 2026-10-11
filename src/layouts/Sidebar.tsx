import { Link, useLocation } from "react-router-dom";
import {
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiFileText,
  FiGrid,
  FiSettings,
  FiSquare,
} from "react-icons/fi";
import OrionMark from "../components/brand/OrionMark";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/app", icon: FiGrid },
  { label: "Focus", path: "/focus", icon: FiClock },
  { label: "Workspace", path: "/tasks", icon: FiSquare },
  { label: "Calendar", path: "/calendar", icon: FiCalendar },
  { label: "Notes", path: "/notes", icon: FiFileText },
  { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
  { label: "Achievements", path: "/achievements", icon: FiAward },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex w-[76px] shrink-0 flex-col items-center justify-between border-r border-white/5 bg-[#10131a] py-4">
      <div className="flex flex-col items-center gap-4">
        <Link to="/app" className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40" aria-label="Orion Companion home">
          <OrionMark className="h-10 w-10" />
        </Link>
        <nav aria-label="Main navigation" className="flex flex-col items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  active ? "bg-[#2a303c] text-white" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Link
          to="/settings"
          title="Settings"
          aria-current={location.pathname === "/settings" ? "page" : undefined}
          className={`flex h-10 w-10 items-center justify-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            location.pathname === "/settings" ? "bg-[#2a303c] text-white" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
          }`}
        >
          <FiSettings className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Settings</span>
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a303c] text-[11px] font-semibold text-zinc-300" title="Personal companion">
          OC
        </div>
      </div>
    </aside>
  );
}
