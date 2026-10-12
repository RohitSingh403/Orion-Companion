// src/components/analytics/ContributionHeatmap.tsx

import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSettingsStore } from "../../store/settingsStore";
import { FiActivity, FiDownload, FiX, FiCalendar, FiFilter } from "react-icons/fi";

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionHeatmapProps {
  data: ContributionDay[];
  levelThresholds?: number[];
}

type FilterLevel = "all" | "1+" | "2+" | "3+" | "4+";

export default function ContributionHeatmap({
  data,
  levelThresholds = [0, 2, 5, 9],
}: ContributionHeatmapProps) {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Process contribution data into a map for easy lookup
  const contributionMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((day) => {
      map.set(day.date, day.count);
    });
    return map;
  }, [data]);

  // Generate the grid data - GitHub style (Sunday-Saturday weeks)
  const { weeks, monthLabels } = useMemo(() => {
    const weeks: ContributionDay[][] = [];
    const monthLabels: { month: string; weekIndex: number }[] = [];
    
    // Start from the Sunday of the selected year
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Adjust to Sunday
    const current = new Date(startDate);
    const dayOfWeek = current.getDay();
    const sundayOffset = dayOfWeek;
    current.setDate(current.getDate() - sundayOffset);
    current.setHours(0, 0, 0, 0);

    let weekIndex = 0;

    // One column per week. Cap the loop so a bad date cannot spin forever.
    while (current <= endDate && weeks.length < 54) {
      const week: ContributionDay[] = [];

      for (let i = 0; i < 7; i++) {
        if (current.getDate() === 1 && current.getFullYear() === selectedYear) {
          monthLabels.push({
            month: current.toLocaleDateString("en-US", { month: "short" }),
            weekIndex,
          });
        }
        const dateStr = localKey(current);
        const count = contributionMap.get(dateStr) || 0;

        week.push({
          date: dateStr,
          count,
        });

        current.setDate(current.getDate() + 1);
      }

      weeks.push(week);
      weekIndex++;
    }

    return { weeks, monthLabels };
  }, [contributionMap, selectedYear]);

  // Filter weeks based on contribution level
  const filteredWeeks = useMemo(() => {
    if (filterLevel === "all") return weeks;
    
    const minLevel = parseInt(filterLevel);
    return weeks.map(week => 
      week.map(day => ({
        ...day,
        count: day.count >= minLevel ? day.count : 0
      }))
    );
  }, [weeks, filterLevel]);

  // Calculate contribution statistics
  const stats = useMemo(() => {
    const totalContributions = data.reduce((sum, day) => sum + day.count, 0);
    const activeDays = data.filter(day => day.count > 0).length;
    const currentStreak = calculateCurrentStreak(data);
    const longestStreak = calculateLongestStreak(data);
    const averagePerDay = activeDays > 0 ? (totalContributions / activeDays).toFixed(1) : "0";
    
    return {
      totalContributions,
      activeDays,
      currentStreak,
      longestStreak,
      averagePerDay,
    };
  }, [data]);

  // Get intensity level based on count
  const getLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= levelThresholds[0]) return 1;
    if (count <= levelThresholds[1]) return 2;
    if (count <= levelThresholds[2]) return 3;
    return 4;
  };

  // Format date for tooltip
  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Export contribution data
  const handleExport = () => {
    const exportData = {
      year: selectedYear,
      stats,
      data: data.filter(day => new Date(day.date).getFullYear() === selectedYear),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributions-${selectedYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectDay = useCallback((day: ContributionDay) => {
    setSelectedDay(day);
  }, []);

  return (
    <div className={`analytics-defer p-6 space-y-4 rounded-xl border ${
      isDark 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>
            <FiActivity className={isDark ? "text-violet-400" : "text-violet-600"} /> Contribution Activity
          </h3>
          
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={`rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
              isDark 
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
            } border`}
          >
            {[selectedYear - 2, selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <FiFilter className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as FilterLevel)}
              className={`rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
              } border`}
            >
              <option value="all">All</option>
              <option value="1+">1+</option>
              <option value="2+">2+</option>
              <option value="3+">3+</option>
              <option value="4+">4+</option>
            </select>
          </div>
          
          <ContributionLegend isDark={isDark} />
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className={`transition-colors ${
              isDark ? "text-gray-500 hover:text-violet-400" : "text-gray-500 hover:text-violet-600"
            }`}
            title="Export contribution data"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contribution Summary Panel */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`border rounded-lg p-3 ${
          isDark 
            ? "bg-gray-700 border-gray-600" 
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className={`text-[10px] mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Total Contributions</div>
          <div className={`text-lg font-semibold ${isDark ? "text-violet-400" : "text-violet-600"}`}>{stats.totalContributions}</div>
        </div>
        <div className={`border rounded-lg p-3 ${
          isDark 
            ? "bg-gray-700 border-gray-600" 
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className={`text-[10px] mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Active Days</div>
          <div className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{stats.activeDays}</div>
        </div>
        <div className={`border rounded-lg p-3 ${
          isDark 
            ? "bg-gray-700 border-gray-600" 
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className={`text-[10px] mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Current Streak</div>
          <div className="text-lg font-semibold text-blue-400">{stats.currentStreak} days</div>
        </div>
        <div className={`border rounded-lg p-3 ${
          isDark 
            ? "bg-gray-700 border-gray-600" 
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className={`text-[10px] mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Longest Streak</div>
          <div className="text-lg font-semibold text-purple-400">{stats.longestStreak} days</div>
        </div>
      </div>

      <div className={`overflow-x-auto border rounded-lg p-4 ${
        isDark 
          ? "bg-gray-700 border-gray-600" 
          : "bg-gray-50 border-gray-200"
      }`}>
        {/* Month labels sit on the week columns. A left margin per label would add up to thousands of pixels. */}
        <div className="relative mb-2 h-4" style={{ marginLeft: 32, width: filteredWeeks.length * 14 }}>
          {monthLabels.map((label) => {
            return (
              <div
                key={`${label.month}-${label.weekIndex}`}
                className={`absolute top-0 text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}
                style={{ left: label.weekIndex * 14 }}
              >
                {label.month}
              </div>
            );
          })}
        </div>

        {/* Heatmap Grid */}
        <div className="flex items-start gap-3">
          <div className={`flex h-[91px] flex-shrink-0 flex-col justify-between pr-2 text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            <span className="h-[11px]"></span>
            <span className="h-[11px]">Mon</span>
            <span className="h-[11px]"></span>
            <span className="h-[11px]">Wed</span>
            <span className="h-[11px]"></span>
            <span className="h-[11px]">Fri</span>
            <span className="h-[11px]"></span>
          </div>
          <HeatmapCanvas weeks={filteredWeeks} onSelect={selectDay} />
        </div>

      </div>

      {/* Day Detail Modal */}
      {selectedDay && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedDay(null)}
        >
          <div 
            className={`border rounded-lg p-6 w-full max-w-md shadow-sm ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                <FiCalendar className={isDark ? "text-violet-400" : "text-violet-600"} />
                {formatDate(selectedDay.date)}
              </h3>
              <button 
                onClick={() => setSelectedDay(null)}
                className={`transition-colors ${
                  isDark ? "text-gray-500 hover:text-gray-100" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`border rounded-lg p-4 ${
                isDark 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className={`text-sm mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Contributions</div>
                <div className={`text-3xl font-bold ${isDark ? "text-violet-400" : "text-violet-600"}`}>{selectedDay.count}</div>
              </div>
              
              <div className={`border rounded-lg p-4 ${
                isDark 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className={`text-sm mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Activity Level</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-[2px]"
                    style={{
                      backgroundColor: getLevel(selectedDay.count) === 0 ? '#161b22' : 
                                     getLevel(selectedDay.count) === 1 ? '#0e4429' : 
                                     getLevel(selectedDay.count) === 2 ? '#006d32' : 
                                     getLevel(selectedDay.count) === 3 ? '#26a641' : '#39d353'
                    }}
                  />
                  <span className={`text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {getLevel(selectedDay.count) === 0 ? 'No activity' : 
                     getLevel(selectedDay.count) === 1 ? 'Low activity' : 
                     getLevel(selectedDay.count) === 2 ? 'Moderate activity' : 
                     getLevel(selectedDay.count) === 3 ? 'High activity' : 'Very high activity'}
                  </span>
                </div>
              </div>
              
              <div className={`text-xs text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                This day had {selectedDay.count} focus session{selectedDay.count !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Stats Footer */}
      <div className={`flex items-center justify-between text-xs pt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
        <span>Average per active day: {stats.averagePerDay} contributions</span>
        <span>Year: {selectedYear}</span>
      </div>
    </div>
  );
}

const LEVEL_COLORS = ["#1c212b", "#164e63", "#0e7490", "#22d3ee", "#7AF0FF"];
const CELL = 11;
const STEP = 14;

function HeatmapCanvas({
  weeks,
  onSelect,
}: {
  weeks: ContributionDay[][];
  onSelect: (day: ContributionDay) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weeksRef = useRef(weeks);
  const hovered = useRef<string | null>(null);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);
  weeksRef.current = weeks;

  const width = Math.max(weeks.length, 1) * STEP;
  const height = 7 * STEP;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    weeks.forEach((week, column) => {
      week.forEach((day, row) => {
        context.fillStyle = LEVEL_COLORS[levelFor(day.count)] ?? LEVEL_COLORS[0];
        context.fillRect(column * STEP, row * STEP, CELL, CELL);
      });
    });
  }, [weeks, width, height]);

  function dayAt(event: MouseEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const column = Math.floor(x / STEP);
    const row = Math.floor(y / STEP);
    if (x - column * STEP > CELL || y - row * STEP > CELL) return null;
    return weeksRef.current[column]?.[row] ?? null;
  }

  return (
    <div className="relative" style={{ width, height }}>
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className="block"
        role="img"
        aria-label={`Contribution activity for ${weeks.length} weeks`}
        onMouseMove={(event) => {
          const day = dayAt(event);
          const key = day?.date ?? null;
          if (key === hovered.current) return;
          hovered.current = key;
          if (!day) {
            setTip(null);
            return;
          }
          const rect = event.currentTarget.getBoundingClientRect();
          setTip({
            text: `${day.count} session${day.count === 1 ? "" : "s"} on ${day.date}`,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
        onMouseLeave={() => {
          hovered.current = null;
          setTip(null);
        }}
        onClick={(event) => {
          const day = dayAt(event);
          if (day) onSelect(day);
        }}
      />
      {tip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded border border-white/10 bg-[#121418] px-2 py-1 text-[10px] text-zinc-100"
          style={{ left: tip.x, top: Math.max(tip.y - 8, 0) }}
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}

function levelFor(count: number) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function localKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Legend Component
function ContributionLegend({ isDark }: { isDark: boolean }) {
  const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  return (
    <div className={`flex items-center gap-2 text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
      <span>Less</span>
      <div className="flex gap-[3px]">
        {colors.map((color, idx) => (
          <div
            key={idx}
            className="w-[11px] h-[11px] rounded-[2px]"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  );
}

// Helper functions
function calculateCurrentStreak(data: ContributionDay[]): number {
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  
  for (const day of sortedData) {
    if (day.count > 0) {
      streak++;
    } else if (streak > 0) {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(data: ContributionDay[]): number {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (const day of sortedData) {
    if (day.count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
}
