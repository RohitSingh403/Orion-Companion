// src/pages/Achievements/AchievementsPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { FiLock, FiCheck } from "react-icons/fi";
import { useAchievementStore } from "../../store/achievementStore";

export default function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const achievements = useAchievementStore((s) => s.achievements);
  const { totalXP, level, xpToNextLevel } = useAchievementStore((s) => ({
    totalXP: s.totalXP,
    level: s.level,
    xpToNextLevel: s.xpToNextLevel,
  }));

  const filteredAchievements = achievements.filter((a) => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });

  const progressPercentage = xpToNextLevel > 0 
    ? Math.round(((level * 1000 - xpToNextLevel) / 1000) * 100)
    : 0;

  const levelTitles = [
    "Novice",
    "Apprentice",
    "Journeyman",
    "Expert",
    "Master",
    "Grandmaster",
    "Deep Worker",
    "Focus Legend",
    "Productivity Sage",
    "Zen Master",
  ];
  const levelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return (
    <AppLayout>
      <Topbar greeting="Gamified Achievements 🏆" subtitle="Unlock badges and level up your focus habit" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Level Banner Card */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden glow-emerald">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-100">Level {level} {levelTitle}</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                  {totalXP} XP
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{xpToNextLevel} XP to Level {level + 1}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-64 space-y-1.5 relative z-10">
            <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          {(["all", "unlocked", "locked"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                filter === tab
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredAchievements.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition relative ${
                item.unlocked
                  ? "glass-card border-emerald-500/30 glow-emerald"
                  : "bg-zinc-900/40 border-zinc-800/60 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">
                  {item.icon || "🏆"}
                </div>
                {item.unlocked ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <FiCheck className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center">
                    <FiLock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="text-sm font-bold text-zinc-100 flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-semibold">
                    +{item.xp || 100} XP
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
