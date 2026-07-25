import Card from "../ui/Card";
import { FaClock, FaChartLine, FaFire } from "react-icons/fa";

interface StatsCardProps {
  completedSessions: number;
  focusMinutes: number;
}

export default function StatsCard({
  completedSessions,
  focusMinutes,
}: StatsCardProps) {
  const productivity =
    completedSessions >= 8
      ? "Excellent"
      : completedSessions >= 4
        ? "Great"
        : completedSessions >= 2
          ? "Good"
          : "Starting";

  return (
    <Card>
      <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-5">
        Today
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaFire className="text-emerald-400" />
            <span className="text-zinc-300">Focus Sessions</span>
          </div>

          <span className="font-bold text-white">{completedSessions}</span>
        </div>

        <div className="h-px bg-zinc-800" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaClock className="text-emerald-400" />
            <span className="text-zinc-300">Focus Minutes</span>
          </div>

          <span className="font-bold text-white">{focusMinutes}m</span>
        </div>

        <div className="h-px bg-zinc-800" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-emerald-400" />
            <span className="text-zinc-300">Productivity</span>
          </div>

          <span className="font-semibold text-emerald-400">{productivity}</span>
        </div>
      </div>
    </Card>
  );
}
