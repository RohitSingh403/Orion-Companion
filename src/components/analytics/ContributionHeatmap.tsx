// src/components/analytics/ContributionHeatmap.tsx

import { useState, useMemo } from "react";
import { FiActivity } from "react-icons/fi";

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionHeatmapProps {
  data: ContributionDay[];
  startDate?: Date;
  endDate?: Date;
  levelThresholds?: number[];
}

export default function ContributionHeatmap({
  data,
  levelThresholds = [0, 2, 5, 9],
}: ContributionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

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
    
    // Start from the Sunday approximately 1 year ago
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    // Adjust to Sunday
    const current = new Date(startDate);
    const dayOfWeek = current.getDay();
    const sundayOffset = dayOfWeek; // 0 = Sunday, 1 = Monday, etc.
    current.setDate(current.getDate() - sundayOffset);
    current.setHours(0, 0, 0, 0);

    let weekIndex = 0;
    let lastMonth = -1;

    // Generate exactly 53 weeks to ensure full year coverage
    const totalWeeks = 53;
    
    for (let w = 0; w < totalWeeks; w++) {
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
  }, [contributionMap]);

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

  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <FiActivity className="text-accent" /> Contribution Activity
        </h3>
        <ContributionLegend />
      </div>

      <div className="card border border-white/10 rounded-lg p-4 bg-white/[0.02]">
        {/* Month Labels */}
        <div className="flex mb-2 pl-8">
          {monthLabels.map((label) => (
            <div
              key={`${label.month}-${label.weekIndex}`}
              className="text-[10px] text-muted font-medium"
              style={{ marginLeft: label.weekIndex === 0 ? 0 : `${label.weekIndex * 14}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-3 items-start">
          {/* Day Labels - GitHub style (Mon, Wed, Fri) */}
          <div className="flex flex-col justify-between text-[10px] text-muted font-medium h-[91px] pr-2 flex-shrink-0">
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
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-[3px] flex-shrink-0">
                {week.map((day) => (
                  <ContributionCell
                    key={day.date}
                    date={day.date}
                    count={day.count}
                    level={getLevel(day.count)}
                    onHover={setHoveredCell}
                    onLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="fixed bg-black/90 backdrop-blur-sm border border-white/20 rounded px-3 py-2 text-xs text-white z-50 pointer-events-none"
               style={{
                 left: `${hoveredCell.x}px`,
                 top: `${hoveredCell.y}px`,
                 transform: 'translate(-50%, -100%)',
                 marginTop: '-8px'
               }}>
            <div className="font-semibold">{hoveredCell.count} contributions</div>
            <div className="text-muted">{formatDate(hoveredCell.date)}</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-muted pt-2">
        <span>Total contributions: {data.reduce((sum, day) => sum + day.count, 0)}</span>
        <span>Active days: {data.filter(day => day.count > 0).length}</span>
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
}

function ContributionCell({ date, count, level, onHover, onLeave }: ContributionCellProps) {
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
      className="w-[11px] h-[11px] rounded-[2px] transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer relative group"
      style={{
        backgroundColor: level === 0 ? '#161b22' : 
                       level === 1 ? '#0e4429' : 
                       level === 2 ? '#006d32' : 
                       level === 3 ? '#26a641' : '#39d353'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-white/20 rounded px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
        {count === 0 ? 'No contributions' : `${count} contributions`}
      </div>
    </div>
  );
}

// Legend Component
function ContributionLegend() {
  const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  return (
    <div className="flex items-center gap-2 text-[10px] text-muted font-medium">
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
