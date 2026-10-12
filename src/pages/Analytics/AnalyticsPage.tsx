// src/pages/Analytics/AnalyticsPage.tsx

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useFocusStore } from "../../store/focusStore";
import { useSettingsStore } from "../../store/settingsStore";
import { FiClock, FiTrendingUp, FiActivity, FiDownload, FiCalendar } from "react-icons/fi";
import ContributionHeatmap from "../../components/analytics/ContributionHeatmap";

function dateKey(date: Date) {
  return date.toLocaleDateString("en-CA");
}

function shiftDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "focus" | "tasks" | "trends">("overview");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "custom">("week");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

  const { history, dailyGoal, bestStreak, getProductivityComparison, getFocusInsights, dailyStats } = useFocusStore();

  // Get productivity comparison
  const productivityComparison = useMemo(() => getProductivityComparison(), [getProductivityComparison]);

  // Get focus insights
  const focusInsights = useMemo(() => getFocusInsights(), [getFocusInsights]);

  // Generate contribution data for heatmap from dailyStats
  const contributionData = useMemo(() => {
    return dailyStats.map((stat) => ({
      date: stat.date,
      count: stat.sessions,
    }));
  }, [dailyStats]);

  const period = useMemo(() => {
    const today = new Date();
    let start = shiftDays(today, -6);
    let end = today;
    if (timeRange === "month") start = shiftDays(today, -29);
    if (timeRange === "year") start = shiftDays(today, -364);
    if (timeRange === "custom" && customStartDate && customEndDate) {
      const customStart = new Date(`${customStartDate}T00:00:00`);
      const customEnd = new Date(`${customEndDate}T00:00:00`);
      if (!Number.isNaN(customStart.getTime()) && !Number.isNaN(customEnd.getTime()) && customStart <= customEnd) {
        start = customStart;
        end = customEnd;
      }
    }

    const startKey = dateKey(start);
    const endKey = dateKey(end);
    const sessions = history.filter((item) => item.date >= startKey && item.date <= endKey);
    const byDate = new Map<string, { sessions: number; minutes: number }>();
    sessions.forEach((item) => {
      const current = byDate.get(item.date) ?? { sessions: 0, minutes: 0 };
      current.sessions += 1;
      current.minutes += item.duration / 60;
      byDate.set(item.date, current);
    });

    const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
    const totalMinutes = sessions.reduce((sum, item) => sum + item.duration / 60, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.round(totalMinutes % 60);
    const daysWithSessions = byDate.size;
    const daysMeetingGoal = Array.from(byDate.values()).filter((day) => dailyGoal > 0 && day.sessions >= dailyGoal).length;

    const buckets: { label: string; minutes: number }[] = [];
    if (timeRange === "year") {
      for (let month = 11; month >= 0; month -= 1) {
        const cursor = new Date(today.getFullYear(), today.getMonth() - month, 1);
        const prefix = dateKey(cursor).slice(0, 7);
        const minutes = sessions
          .filter((item) => item.date.startsWith(prefix))
          .reduce((sum, item) => sum + item.duration / 60, 0);
        buckets.push({ label: cursor.toLocaleDateString("en-US", { month: "short" }), minutes });
      }
    } else if (timeRange === "month") {
      for (let week = 0; week < 4; week += 1) {
        const bucketStart = shiftDays(start, week * 7);
        const bucketEnd = shiftDays(bucketStart, 6);
        const minutes = sessions
          .filter((item) => item.date >= dateKey(bucketStart) && item.date <= dateKey(bucketEnd))
          .reduce((sum, item) => sum + item.duration / 60, 0);
        buckets.push({ label: `Week ${week + 1}`, minutes });
      }
    } else {
      const span = timeRange === "custom" ? Math.min(dayCount, 14) : 7;
      const bucketStart = timeRange === "custom" ? start : shiftDays(today, -6);
      for (let index = 0; index < span; index += 1) {
        const day = shiftDays(bucketStart, index);
        const key = dateKey(day);
        buckets.push({
          label: day.toLocaleDateString("en-US", { weekday: "short" }),
          minutes: byDate.get(key)?.minutes ?? 0,
        });
      }
    }

    const peak = Math.max(...buckets.map((bucket) => bucket.minutes), 1);
    let bestLabel = "None yet";
    let bestMinutes = 0;
    byDate.forEach((value, key) => {
      if (value.minutes > bestMinutes) {
        bestMinutes = value.minutes;
        bestLabel = new Date(`${key}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      }
    });

    const consistency = Math.round((daysWithSessions / dayCount) * 100);
    const goalRate = Math.round((daysMeetingGoal / dayCount) * 100);
    const streakStrength = Math.min(100, Math.round((bestStreak / 7) * 100));
    const overall = Math.round((consistency + goalRate + streakStrength) / 3);

    return {
      totalFocusTimeDisplay: `${totalHours}h ${remainingMinutes}m`,
      totalSessions: sessions.length,
      avgSessionsPerDay: (sessions.length / dayCount).toFixed(1),
      avgFocusPerDay: (totalMinutes / dayCount / 60).toFixed(1),
      bestDay: bestLabel,
      days: buckets.map((bucket) => bucket.label),
      heights: buckets.map((bucket) => (bucket.minutes === 0 ? 0 : Math.max(8, Math.round((bucket.minutes / peak) * 100)))),
      details: buckets.map((bucket) => `${Math.round(bucket.minutes)}m`),
      consistency,
      goalRate,
      streakStrength,
      overall,
    };
  }, [bestStreak, customEndDate, customStartDate, dailyGoal, history, timeRange]);

  const rangeStats = period;
  const periodStats = period;
  const trendData = period;

  // Export analytics data
  const handleExport = () => {
    const exportData = {
      timeRange,
      stats: rangeStats,
      periodStats,
      productivityComparison,
      focusInsights,
      totalSessions: rangeStats.totalSessions,
      bestStreak,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-companion-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Topbar subtitle="Visualize focus trends & GitHub-style heatmap" />
      <div className="flex-1 p-8 space-y-6 overflow-auto no-scrollbar">
        {/* Navigation Tabs */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark 
            ? "border-gray-700" 
            : "border-gray-200"
        }`}>
          <div className="flex items-center gap-2">
            {(["overview", "focus", "tasks", "trends"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-300 border border-violet-500/30" 
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
          <div className={`flex items-center gap-1 p-1 rounded-lg ${
            isDark 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-gray-100 border border-gray-200"
          }`}>
            {(["week", "month", "year", "custom"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  timeRange === range
                    ? "btn-primary"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100" 
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
              isDark 
                ? "text-gray-400 hover:text-violet-300 hover:bg-gray-700" 
                : "text-gray-600 hover:text-violet-600 hover:bg-gray-100"
            }`}
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Custom Date Range Picker */}
        {timeRange === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`p-4 space-y-3 rounded-xl border shadow-sm ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <FiCalendar className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Custom Date Range</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={`text-xs mb-1 block ${isDark ? "text-gray-500" : "text-gray-500"}`}>Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                  } border`}
                />
              </div>
              <div className="flex-1">
                <label className={`text-xs mb-1 block ${isDark ? "text-gray-500" : "text-gray-500"}`}>End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                  } border`}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className={`p-5 space-y-2 rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className={`flex items-center justify-between ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <span className="text-sm font-medium">Total Focus Time ({timeRange})</span>
              <FiClock className={isDark ? "text-violet-300" : "text-violet-600"} />
            </div>
            <p className={`text-2xl font-semibold ${isDark ? "text-violet-300" : "text-violet-600"}`}>{rangeStats.totalFocusTimeDisplay}</p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
              isDark 
                ? "bg-violet-500/10 text-violet-300 border border-violet-500/30" 
                : "bg-violet-50 text-violet-600 border border-violet-200"
            }`}>
              {rangeStats.totalSessions > 0 ? "↑ Building momentum" : "Start your first session"}
            </span>
          </div>

          <div className={`p-5 space-y-2 rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className={`flex items-center justify-between ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <span className="text-sm font-medium">Total Sessions ({timeRange})</span>
              <FiActivity className="text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-blue-400">{rangeStats.totalSessions}</p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
              isDark 
                ? "bg-violet-500/10 text-violet-300 border border-violet-500/30" 
                : "bg-violet-50 text-violet-600 border border-violet-200"
            }`}>
              Best Streak: {bestStreak} days
            </span>
          </div>

          <div className={`p-5 space-y-2 rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className={`flex items-center justify-between ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <span className="text-sm font-medium">Productivity vs Yesterday</span>
              <FiTrendingUp className="text-purple-400" />
            </div>
            <p className={`text-2xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              {productivityComparison.percentage > 0 ? "+" : ""}{productivityComparison.percentage}%
            </p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
              isDark 
                ? "bg-violet-500/10 text-violet-300 border border-violet-500/30" 
                : "bg-violet-50 text-violet-600 border border-violet-200"
            }`}>
              {productivityComparison.label}
            </span>
          </div>
        </div>

        {/* Period Statistics */}
        <div className={`p-6 space-y-4 rounded-xl border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            <FiActivity className={isDark ? "text-violet-300" : "text-violet-600"} /> {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Avg Sessions/Day</p>
              <p className={`text-xl font-semibold mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{periodStats.avgSessionsPerDay}</p>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Avg Focus/Day</p>
              <p className={`text-xl font-semibold mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{periodStats.avgFocusPerDay}h</p>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Best {timeRange === "week" ? "Day" : timeRange === "month" ? "Week" : "Month"}</p>
              <p className={`text-xl font-semibold mt-1 ${isDark ? "text-violet-300" : "text-violet-600"}`}>{periodStats.bestDay}</p>
            </div>
          </div>
        </div>

        {/* Focus Insights */}
        <div className={`p-6 space-y-4 rounded-xl border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            <FiTrendingUp className={isDark ? "text-violet-300" : "text-violet-600"} /> Personalized Insights
          </h3>
          <div className="space-y-3">
            {focusInsights.map((insight, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isDark 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isDark ? "bg-violet-300" : "bg-violet-600"}`} />
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-500" : "text-gray-500"}`}>{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Scorecard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 space-y-4 rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            <FiTrendingUp className={isDark ? "text-violet-300" : "text-violet-600"} /> Productivity Scorecard
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Focus Consistency</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-pink-600 rounded-full"
                    style={{ width: `${rangeStats.consistency}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {rangeStats.consistency}%
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Goal Achievement</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${rangeStats.goalRate}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {rangeStats.goalRate}%
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Streak Strength</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${rangeStats.streakStrength}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {rangeStats.streakStrength}%
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Overall Score</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    style={{ width: `${rangeStats.overall}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-gray-900"}`}>
                  {rangeStats.overall}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Focus Time Trend Chart */}
        <div className={`p-6 space-y-4 rounded-xl border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <div className={`flex items-center justify-between`}>
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              <FiTrendingUp className={isDark ? "text-violet-300" : "text-violet-600"} /> Focus Time Trend ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})
            </h3>
            <div className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isDark ? "bg-violet-300" : "bg-violet-600"}`}></span>
                Focus Time
              </span>
            </div>
          </div>
          <div className={`h-52 flex items-end justify-between gap-3 pt-6 px-4 border-b pb-2 ${
            isDark 
              ? "border-gray-700" 
              : "border-gray-200"
          }`}>
            {trendData.days.map((day, idx) => (
              <div key={`${day}-${idx}`} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="relative w-full">
                  <div
                    style={{ height: `${trendData.heights[idx]}%` }}
                    className={`w-full border-t-2 rounded-t-md transition-all duration-300 hover:brightness-125 cursor-pointer relative ${
                      isDark 
                        ? "bg-gradient-to-t from-violet-500/30 via-violet-500/60 to-violet-500 border-t-violet-500" 
                        : "bg-gradient-to-t from-violet-500/30 via-violet-500/60 to-violet-500 border-t-violet-500"
                    }`}
                  >
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                      isDark 
                        ? "bg-gray-700 border border-gray-600 text-gray-100" 
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}>
                      {trendData.details[idx]}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-medium mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{day}</span>
              </div>
            ))}
          </div>
          <div className={`flex items-center justify-between text-xs pt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            <span>Low activity</span>
            <span>High activity</span>
          </div>
        </div>

        {/* GitHub-style Productivity Heatmap */}
        <ContributionHeatmap data={contributionData} />
      </div>
    </AppLayout>
  );
}
