import { useState } from "react";

interface DashboardTabsProps {
  dashboard: React.ReactNode;
  achievements: React.ReactNode;
}

export default function DashboardTabs({
  dashboard,
  achievements,
}: DashboardTabsProps) {
  const [tab, setTab] = useState<"dashboard" | "achievements">("dashboard");

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("dashboard")}
          className={`flex-1 rounded-xl py-2 font-medium transition ${
            tab === "dashboard"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setTab("achievements")}
          className={`flex-1 rounded-xl py-2 font-medium transition ${
            tab === "achievements"
              ? "bg-yellow-500 text-black"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          🏆 Achievements
        </button>
      </div>

      {tab === "dashboard" ? dashboard : achievements}
    </>
  );
}
