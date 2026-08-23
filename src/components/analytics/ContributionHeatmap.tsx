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
  startDate,
  endDate,
  levelThresholds = [0, 2, 5, 9],
}: ContributionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  // Default to 1 year ago to now
  const defaultStartDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }, []);

  const defaultEndDate = useMemo(() => new Date(), []);

  const start = startDate || defaultStartDate;
  const end = endDate || defaultEndDate;

  // Process contribution data into a map for easy lookup
  const contributionMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((day) => {
      map.set(day.date, day.count);
    });
    return map;
  }, [data]);

  // Generate the grid data
  const { weeks, monthLabels } = useMemo(() => {
    const weeks: ContributionDay[][] = [];
    const monthLabels: { month: string; weekIndex: number }[] = [];
    
    // Start from the Monday before the start date
    const current = new Date(start);
    const dayOfWeek = current.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    current.setDate(current.getDate() - mondayOffset);
    current.setHours(0, 0, 0, 0);

    let weekIndex = 0;
    let lastMonth = -1;

    while (current <= end) {
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

      // Create 7 days for this week
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
  }, [start, end, contributionMap]);

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
              style={{ marginLeft: label.weekIndex === 0 ? 0 : '12px' }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1 items-start">
          {/* Day Labels */}
          <div className="grid grid-rows-7 text-[10px] text-muted font-medium h-32 justify-between pr-2 flex-shrink-0 leading-3">
            <span className="flex items-center">Mon</span>
            <span className="flex items-center">Wed</span>
            <span className="flex items-center">Fri</span>
          </div>

          {/* Weeks */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-1 flex-shrink-0">
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
      className={`w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer heatmap-level-${level} relative group`}
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
  return (
    <div className="flex items-center gap-2 text-[10px] text-muted font-medium">
      <span>Less</span>
      <div className="flex gap-1">
        <span className="w-3 h-3 rounded-sm heatmap-level-0"></span>
        <span className="w-3 h-3 rounded-sm heatmap-level-1"></span>
        <span className="w-3 h-3 rounded-sm heatmap-level-2"></span>
        <span className="w-3 h-3 rounded-sm heatmap-level-3"></span>
        <span className="w-3 h-3 rounded-sm heatmap-level-4"></span>
      </div>
      <span>More</span>
    </div>
  );
}
