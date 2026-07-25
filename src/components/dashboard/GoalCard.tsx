import Card from "../ui/Card";

interface GoalCardProps {
  completedSessions: number;
  goal: number;
}

export default function GoalCard({ completedSessions, goal }: GoalCardProps) {
  const percentage =
    goal === 0 ? 0 : Math.min((completedSessions / goal) * 100, 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Daily Goal
          </p>

          <h2 className="text-2xl font-bold text-white mt-1">
            {completedSessions} / {goal}
          </h2>

          <p className="text-sm text-zinc-400 mt-1">Sessions Completed</p>
        </div>

        <div className="text-4xl">🎯</div>
      </div>

      <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-3 text-sm">
        <span className="text-zinc-500">Progress</span>

        <span className="font-semibold text-emerald-400">
          {Math.round(percentage)}%
        </span>
      </div>
    </Card>
  );
}
