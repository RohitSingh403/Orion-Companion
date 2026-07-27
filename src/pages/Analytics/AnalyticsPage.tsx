// src/pages/Analytics/AnalyticsPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { FiClock, FiCheckCircle, FiTrendingUp, FiActivity } from "react-icons/fi";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "focus" | "tasks" | "trends">("overview");

  // GitHub-style contribution heatmap grid (5 weeks x 7 days)
  const heatmapData = [
    [0, 1, 3, 2, 4, 1, 0],
    [2, 4, 1, 3, 2, 0, 1],
    [1, 2, 4, 4, 3, 2, 1],
    [3, 1, 2, 1, 4, 3, 2],
    [4, 3, 1, 4, 2, 1, 0],
  ];

  return (
    <AppLayout>
      <Topbar greeting="Productivity Analytics 📈" subtitle="Visualize focus trends & GitHub-style heatmap" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          {(["overview", "focus", "tasks", "trends"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Total Focus Time</span>
              <FiClock className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">12h 45m</p>
            <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ↑ 18% vs last week
            </span>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Total Sessions</span>
              <FiActivity className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">32</p>
            <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ↑ 14% vs last week
            </span>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">Tasks Completed</span>
              <FiCheckCircle className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">28</p>
            <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ↑ 22% vs last week
            </span>
          </div>
        </div>

        {/* Focus Time Trend Chart Mockup */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <FiTrendingUp className="text-emerald-400" /> Focus Time Trend
          </h3>
          <div className="h-40 flex items-end justify-between gap-3 pt-6 px-4">
            {["May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20"].map((day, idx) => {
              const heights = ["40%", "65%", "35%", "85%", "95%", "60%", "75%"];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    style={{ height: heights[idx] }}
                    className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 border-t-2 border-emerald-400 rounded-t-md transition-all hover:brightness-125"
                  />
                  <span className="text-[10px] text-zinc-500 font-medium">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* GitHub-style Productivity Heatmap */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">Productivity Heatmap</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-sm heatmap-level-0 border border-zinc-800"></span>
              <span className="w-2.5 h-2.5 rounded-sm heatmap-level-1"></span>
              <span className="w-2.5 h-2.5 rounded-sm heatmap-level-2"></span>
              <span className="w-2.5 h-2.5 rounded-sm heatmap-level-3"></span>
              <span className="w-2.5 h-2.5 rounded-sm heatmap-level-4"></span>
              <span>More</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="grid grid-rows-7 text-[10px] text-zinc-500 font-medium h-28 justify-between pr-2">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {heatmapData.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-1.5">
                  {week.map((level, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 heatmap-level-${level}`}
                      title={`Activity level: ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
