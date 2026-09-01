// src/components/analytics/ContributionHeatmap.tsx

import { useState, useMemo } from "react";
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
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
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
    let lastMonth = -1;

    // Generate weeks for the entire year
    while (current <= endDate) {
      const week: ContributionDay[] = [];
      const currentMonth = current.getMonth();

      // Add month label if this is the first day of a new month
      if (currentMonth !== lastMonth) {
        monthLabels.push({
          month: current.toLocaleDateString("en-US", { month: "short" }),
          weekIndex,
        });
        lastMonth = currentMonth;
      }

      // Create 7 days for this week (Sunday-Saturday)
      for (let i = 0; i < 7; i++) {
        const dateStr = current.toISOString().split("T")[0];
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
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, day: ContributionDay) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedDay(day);
    }
  };

  return (
    <div className={`p-6 space-y-4 rounded-xl border shadow-sm ${
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

      <div className={`border rounded-lg p-4 ${
        isDark 
          ? "bg-gray-700 border-gray-600" 
          : "bg-gray-50 border-gray-200"
      }`}>
        {/* Month Labels */}
        <div className="flex mb-2 pl-8">
          {monthLabels.map((label) => (
            <div
              key={`${label.month}-${label.weekIndex}`}
              className={`text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}
              style={{ marginLeft: label.weekIndex === 0 ? 0 : `${label.weekIndex * 14}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-3 items-start">
          {/* Day Labels - GitHub style (Mon, Wed, Fri) */}
          <div className={`flex flex-col justify-between text-[10px] font-medium h-[91px] pr-2 flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            <span className="h-[11px]"></span>
            <span className="h-[11px]">Mon</span>
            <span className="h-[11px]"></span>
            <span className="h-[11px]">Wed</span>
            <span className="h-[11px]"></span>
            <span className="h-[11px]">Fri</span>
            <span className="h-[11px]"></span>
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px]">
            {filteredWeeks.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-[3px] flex-shrink-0">
                {week.map((day) => (
                  <ContributionCell
                    key={day.date}
                    date={day.date}
                    count={day.count}
                    level={getLevel(day.count)}
                    onHover={setHoveredCell}
                    onLeave={() => setHoveredCell(null)}
                    onClick={() => setSelectedDay(day)}
                    onKeyDown={(e) => handleKeyDown(e, day)}
                    isDark={isDark}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className={`fixed backdrop-blur-sm border rounded px-3 py-2 text-xs z-50 pointer-events-none ${
            isDark 
              ? "bg-gray-900/90 border-gray-600 text-gray-100" 
              : "bg-gray-900/90 border-gray-300 text-white"
          }`}
               style={{
                 left: `${hoveredCell.x}px`,
                 top: `${hoveredCell.y}px`,
                 transform: 'translate(-50%, -100%)',
                 marginTop: '-8px'
               }}>
            <div className="font-semibold">{hoveredCell.count} contributions</div>
            <div className={isDark ? "text-gray-400" : "text-gray-300"}>{formatDate(hoveredCell.date)}</div>
          </div>
        )}
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
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
        </div>
      )}

      {/* Stats Footer */}
      <div className={`flex items-center justify-between text-xs pt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
        <span>Average per active day: {stats.averagePerDay} contributions</span>
        <span>Year: {selectedYear}</span>
      </div>
    </div>
  );
}

// Contribution Cell Component
interface ContributionCellProps {
  date: string;
  count: number;
  level: number;
  onHover: (data: { date: string; count: number; x: number; y: number }) => void;
  onLeave: () => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isDark: boolean;
}

function ContributionCell({ date, count, level, onHover, onLeave, onClick, onKeyDown, isDark }: ContributionCellProps) {
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onHover({
      date,
      count,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <div
      className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer relative group focus:outline-none focus:ring-2 ${
        isDark ? "focus:ring-violet-500/50" : "focus:ring-violet-500/50"
      }`}
      style={{
        backgroundColor: level === 0 ? '#161b22' : 
                       level === 1 ? '#0e4429' : 
                       level === 2 ? '#006d32' : 
                       level === 3 ? '#26a641' : '#39d353'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${count} contributions on ${date}`}
    >
      <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 backdrop-blur-sm border rounded px-2 py-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none ${
        isDark 
          ? "bg-gray-900/80 border-gray-600 text-gray-100" 
          : "bg-gray-900/80 border-gray-300 text-white"
      }`}>
        {count === 0 ? 'No contributions' : `${count} contributions`}
      </div>
    </div>
  );
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
