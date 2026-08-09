// src/pages/Achievements/AchievementsPage.tsx

import { useState, useMemo } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { FiLock, FiCheck, FiRefreshCw } from "react-icons/fi";
import { useAchievementStore } from "../../store/achievementStore";

export default function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  
  const store = useAchievementStore();
  
  const achievements = store.achievements || [];
  const totalXP = store.totalXP ?? 0;
  const level = store.level ?? 1;
  const xpToNextLevel = store.xpToNextLevel ?? 1000;
  const resetAchievements = store.resetAchievements;

  const filteredAchievements = useMemo(() => {
    if (!Array.isArray(achievements)) return [];
    return achievements.filter((a) => {
      if (filter === "unlocked") return a.unlocked;
      if (filter === "locked") return !a.unlocked;
      return true;
    });
  }, [achievements, filter]);

  const progressPercentage = useMemo(() => {
    if (xpToNextLevel <= 0) return 0;
    const safeLevel = Math.max(1, level || 1);
    return Math.round(((safeLevel * 1000 - xpToNextLevel) / 1000) * 100);
  }, [level, xpToNextLevel]);

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
  
  const safeLevel = Math.max(1, Math.min(level || 1, 100));
  const levelTitle = levelTitles[Math.min(safeLevel - 1, levelTitles.length - 1)] || "Novice";

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all achievements? This cannot be undone.")) {
      resetAchievements();
    }
  };

  if (!Array.isArray(achievements) || achievements.length === 0) {
    return (
      <AppLayout>
        <Topbar greeting="Gamified Achievements 🏆" subtitle="Unlock badges and level up your focus habit" />
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          <div className="glass-card p-8 rounded-2xl text-center border-gradient">
            <p className="text-sm text-zinc-400 mb-4">Achievements data is corrupted or missing.</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 btn-premium text-zinc-950 text-xs font-semibold rounded-xl transition-all"
            >
              Reset Achievements
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Topbar greeting="Gamified Achievements 🏆" subtitle="Unlock badges and level up your focus habit" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Level Banner Card */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden border-gradient glow-emerald">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl glass-card border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gradient-emerald">Level {safeLevel} {levelTitle}</h2>
                <span className="px-2 py-0.5 rounded badge-premium text-emerald-400 text-[10px] font-semibold">
                  {totalXP} XP
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{xpToNextLevel} XP to Level {safeLevel + 1}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-64 space-y-1.5 relative z-10">
            <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div className="h-full progress-premium-bar rounded-full transition-all" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3">
          <div className="flex items-center gap-2">
            {(["all", "unlocked", "locked"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald"
                    : "text-zinc-400 hover:text-zinc-200 hover:border hover:border-zinc-700/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center border-gradient">
            <p className="text-sm text-zinc-400">No achievements found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all relative ${
                  item.unlocked
                    ? "glass-card border-emerald-500/30 glow-emerald"
                    : "glass-card border-zinc-800/60 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl glass-card border border-zinc-800 flex items-center justify-center text-2xl">
                    {item.icon || "🏆"}
                  </div>
                  {item.unlocked ? (
                    <span className="w-6 h-6 rounded-full glass-card border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                      <FiCheck className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full glass-card border border-zinc-800 text-zinc-500 flex items-center justify-center">
                      <FiLock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-sm font-bold text-zinc-100 flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-amber-400 badge-premium font-semibold">
                      +{item.xp || 100} XP
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
