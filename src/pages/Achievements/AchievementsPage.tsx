// src/pages/Achievements/AchievementsPage.tsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { FiLock, FiCheck, FiRefreshCw, FiFilter } from "react-icons/fi";
import { useAchievementStore } from "../../store/achievementStore";
import type { AchievementCategory, AchievementRarity } from "../../types/achievement";

export default function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | "all">("all");
  const [rarityFilter, setRarityFilter] = useState<AchievementRarity | "all">("all");
  
  const store = useAchievementStore();
  
  const achievements = store.achievements || [];
  const totalXP = store.totalXP ?? 0;
  const level = store.level ?? 1;
  const xpToNextLevel = store.xpToNextLevel ?? 1000;
  const resetAchievements = store.resetAchievements;

  const filteredAchievements = useMemo(() => {
    if (!Array.isArray(achievements)) return [];
    return achievements.filter((a) => {
      if (filter === "unlocked" && !a.unlocked) return false;
      if (filter === "locked" && a.unlocked) return false;
      if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
      if (rarityFilter !== "all" && a.rarity !== rarityFilter) return false;
      return true;
    });
  }, [achievements, filter, categoryFilter, rarityFilter]);

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

  const getRarityColor = (rarity?: AchievementRarity) => {
    switch (rarity) {
      case "common":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
      case "rare":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "epic":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "legendary":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-white/5 text-secondary border-white/10";
    }
  };

  const getRarityLabel = (rarity?: AchievementRarity) => {
    switch (rarity) {
      case "common":
        return "Common";
      case "rare":
        return "Rare";
      case "epic":
        return "Epic";
      case "legendary":
        return "Legendary";
      default:
        return "";
    }
  };

  const getCategoryLabel = (category?: AchievementCategory) => {
    switch (category) {
      case "streak":
        return "Streak";
      case "sessions":
        return "Sessions";
      case "time":
        return "Time";
      case "tasks":
        return "Tasks";
      case "special":
        return "Special";
      default:
        return "";
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all achievements? This cannot be undone.")) {
      resetAchievements();
    }
  };

  if (!Array.isArray(achievements) || achievements.length === 0) {
    return (
      <AppLayout>
        <Topbar subtitle="Unlock badges and level up your focus habit" />
        <div className="flex-1 p-8 space-y-6 overflow-auto no-scrollbar">
          <div className="card-elevated p-8 text-center">
            <p className="text-sm text-secondary mb-4">Achievements data is corrupted or missing.</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 btn-primary text-sm font-medium rounded-lg"
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
      <Topbar subtitle="Unlock badges and level up your focus habit" />
      <div className="flex-1 p-8 space-y-6 overflow-auto no-scrollbar">
        {/* Level Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-elevated p-6 flex items-center justify-between relative overflow-hidden"
        >
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-purple-500/10 pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-lg card border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-accent">Level {safeLevel} {levelTitle}</h2>
                <span className="px-2 py-0.5 rounded badge-success text-accent text-xs font-medium">
                  {totalXP} XP
                </span>
              </div>
              <p className="text-sm text-secondary mt-0.5">{xpToNextLevel} XP to Level {safeLevel + 1}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-64 space-y-1.5 relative z-10">
            <div className="flex justify-between text-xs font-medium text-secondary">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                className="h-full progress-bar rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/6 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "unlocked", "locked"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === tab
                    ? "bg-white/10 text-primary"
                    : "text-secondary hover:text-primary hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-secondary" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as AchievementCategory | "all")}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent/50"
              >
                <option value="all">All Categories</option>
                <option value="streak">Streak</option>
                <option value="sessions">Sessions</option>
                <option value="time">Time</option>
                <option value="tasks">Tasks</option>
                <option value="special">Special</option>
              </select>
            </div>

            {/* Rarity Filter */}
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as AchievementRarity | "all")}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent/50"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Achievements Grid */}
        <AnimatePresence mode="wait">
          {filteredAchievements.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card-elevated p-8 text-center"
            >
              <p className="text-sm text-secondary">No achievements found for this filter.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAchievements.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-lg border transition-all relative ${
                    item.unlocked
                      ? "card border-accent/30"
                      : "card border-white/10 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg card border border-white/10 flex items-center justify-center text-2xl">
                      {item.icon || "🏆"}
                    </div>
                    {item.unlocked ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full card border border-accent/40 text-accent flex items-center justify-center"
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                      </motion.span>
                    ) : (
                      <span className="w-6 h-6 rounded-full card border border-white/10 text-muted flex items-center justify-center">
                        <FiLock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-primary">{item.title}</h4>
                      {item.rarity && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getRarityColor(item.rarity)}`}>
                          {getRarityLabel(item.rarity)}
                        </span>
                      )}
                    </div>
                    
                    {item.category && (
                      <span className="text-[9px] text-muted uppercase tracking-wider">
                        {getCategoryLabel(item.category)}
                      </span>
                    )}
                    
                    <p className="text-sm text-secondary leading-relaxed">{item.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs text-amber-400 badge font-medium">
                        +{item.xp || 100} XP
                      </span>
                      {item.unlockedAt && (
                        <span className="text-[10px] text-muted">
                          {new Date(item.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
