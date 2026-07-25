import Card from "../ui/Card";
import { useFocusStore } from "../../store/focusStore";

export default function AdvancedStats() {
  const {
    completedSessions,
    focusDuration,
    dailyGoal,
    currentStreak,
    history,
  } = useFocusStore();

  const totalFocusMinutes = Math.floor(
    (completedSessions * focusDuration) / 60,
  );

  const goalPercentage = Math.min(
    Math.round((completedSessions / dailyGoal) * 100),
    100,
  );

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">📊 Advanced Statistics</h2>

      <div className="space-y-4">
        <StatRow label="Today's Sessions" value={`${completedSessions}`} />

        <StatRow label="Focus Time" value={`${totalFocusMinutes} min`} />

        <StatRow label="Daily Goal" value={`${goalPercentage}%`} />

        <StatRow label="Current Streak" value={`${currentStreak} Days`} />

        <StatRow label="History Entries" value={`${history.length}`} />
      </div>
    </Card>
  );
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
      <span className="text-zinc-400">{label}</span>

      <span className="font-semibold">{value}</span>
    </div>
  );
}
