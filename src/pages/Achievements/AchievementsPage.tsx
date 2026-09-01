// src/pages/Achievements/AchievementsPage.tsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { FiLock, FiCheck, FiRefreshCw, FiFilter } from "react-icons/fi";
import { useAchievementStore } from "../../store/achievementStore";
import { useSettingsStore } from "../../store/settingsStore";
import type { AchievementCategory, AchievementRarity } from "../../types/achievement";

export default function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | "all">("all");
  const [rarityFilter, setRarityFilter] = useState<AchievementRarity | "all">("all");
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";
  
  const store = useAchievementStore();
  
  const achievements = useMemo(() => store.achievements || [], [store.achievements]);
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
        return isDark ? "bg-gray-700/50 text-gray-400 border-gray-600" : "bg-gray-100 text-gray-600 border-gray-200";
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
          <div className={`p-8 text-center rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Achievements data is corrupted or missing.</p>
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
          className={`p-6 flex items-center justify-between relative overflow-hidden rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}
        >
          {/* Ambient glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r pointer-events-none ${
            isDark 
              ? "from-violet-500/10 via-transparent to-pink-500/10" 
              : "from-violet-500/5 via-transparent to-pink-500/5"
          }`} />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow ${
              isDark 
                ? "bg-amber-500/10 border border-amber-500/40 text-amber-400" 
                : "bg-amber-50 border border-amber-200 text-amber-600"
            }`}>
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-semibold ${isDark ? "text-violet-400" : "text-violet-600"}`}>Level {safeLevel} {levelTitle}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  isDark 
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                    : "bg-violet-50 text-violet-600 border border-violet-200"
                }`}>
                  {totalXP} XP
                </span>
              </div>
              <p className={`text-sm mt-0.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{xpToNextLevel} XP to Level {safeLevel + 1}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-64 space-y-1.5 relative z-10">
            <div className={`flex justify-between text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-100 border-gray-200"
            }`}>
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
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-3 ${
          isDark 
            ? "border-gray-700" 
            : "border-gray-200"
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "unlocked", "locked"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === tab
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as AchievementCategory | "all")}
                className={`rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                    : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                } border`}
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
              className={`rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
              } border`}
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <button
              onClick={handleReset}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
                isDark 
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10" 
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
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
              className={`p-8 text-center rounded-xl border shadow-sm ${
                isDark 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200"
              }`}
            >
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>No achievements found for this filter.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto"
            >
              {filteredAchievements.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-lg border transition-all relative ${
                    item.unlocked
                      ? isDark 
                        ? "bg-gray-800 border-violet-500/30" 
                        : "bg-white border-violet-200"
                      : isDark 
                        ? "bg-gray-800 border-gray-700 opacity-60" 
                        : "bg-white border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isDark 
                        ? "bg-gray-700 border border-gray-600" 
                        : "bg-gray-50 border border-gray-200"
                    }`}>
                      {item.icon || "🏆"}
                    </div>
                    {item.unlocked ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isDark 
                            ? "bg-violet-500/10 border border-violet-500/40 text-violet-400" 
                            : "bg-violet-50 border border-violet-200 text-violet-600"
                        }`}
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                      </motion.span>
                    ) : (
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isDark 
                          ? "bg-gray-700 border border-gray-600 text-gray-500" 
                          : "bg-gray-100 border border-gray-200 text-gray-400"
                      }`}>
                        <FiLock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{item.title}</h4>
                      {item.rarity && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getRarityColor(item.rarity)}`}>
                          {getRarityLabel(item.rarity)}
                        </span>
                      )}
                    </div>
                    
                    {item.category && (
                      <span className={`text-[9px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    )}
                    
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-500" : "text-gray-500"}`}>{item.description}</p>
                    
                    <div className={`flex items-center justify-between pt-2 border-t ${
                      isDark 
                        ? "border-gray-700" 
                        : "border-gray-200"
                    }`}>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        isDark 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" 
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        +{item.xp || 100} XP
                      </span>
                      {item.unlockedAt && (
                        <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
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
