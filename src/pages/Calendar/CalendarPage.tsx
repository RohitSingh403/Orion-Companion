// src/pages/Calendar/CalendarPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  const dates = [
    { day: "Mon", date: 20, active: false },
    { day: "Tue", date: 21, active: false },
    { day: "Wed", date: 22, active: true },
    { day: "Thu", date: 23, active: false },
    { day: "Fri", date: 24, active: false },
    { day: "Sat", date: 25, active: false },
    { day: "Sun", date: 26, active: false },
  ];

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];

  return (
    <AppLayout>
      <Topbar greeting="Calendar Schedule 📅" subtitle="Plan your focus sessions & meetings" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Header Controls */}
        <div className="flex items-center justify-between glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  viewMode === mode
                    ? "bg-emerald-500 text-zinc-950 shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-zinc-100">
              May 20 – May 26, 2024
            </span>
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-800">
            Today
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-3 text-center">
          {dates.map((d) => (
            <div
              key={d.date}
              className={`p-3 rounded-2xl border transition ${
                d.active
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 glow-emerald"
                  : "glass-card text-zinc-400 border-zinc-800/80"
              }`}
            >
              <p className="text-xs font-medium">{d.day}</p>
              <p className="text-lg font-bold text-zinc-100 mt-0.5">{d.date}</p>
            </div>
          ))}
        </div>

        {/* Interactive Timeline Grid */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <FiClock className="text-emerald-400" /> Hourly Schedule
          </h3>
          <div className="space-y-3">
            {timeSlots.map((time, idx) => (
              <div key={time} className="flex items-start gap-4 pt-2 border-t border-zinc-800/50">
                <span className="w-16 text-xs text-zinc-500 font-medium">{time}</span>
                <div className="flex-1 min-h-[48px] rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800/80 p-2 relative">
                  {idx === 0 && (
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-lg text-xs font-medium shadow-sm">
                      🎯 Deep Focus Session — Build Workspace UI (9:00 AM - 11:00 AM)
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="bg-purple-500/20 border border-purple-500/40 text-purple-300 p-2.5 rounded-lg text-xs font-medium shadow-sm">
                      🎨 Design Review Meeting (11:00 AM - 12:00 PM)
                    </div>
                  )}
                  {idx === 3 && (
                    <div className="bg-blue-500/20 border border-blue-500/40 text-blue-300 p-2 rounded-lg text-xs font-medium shadow-sm">
                      ☕ Scheduled Rest Break (1:00 PM - 1:15 PM)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
