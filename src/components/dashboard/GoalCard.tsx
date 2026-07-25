import Card from "../ui/Card";

interface GoalCardProps {
  completedSessions: number;
  goal: number;
}

export default function GoalCard({
  completedSessions,
  goal,
}: GoalCardProps) {
  const percentage = Math.min(
    (completedSessions / goal) * 100,
    100
  );

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-semibold mb-4">
        🎯 Today's Goal
      </h2>

      <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-4 text-zinc-400">
        {completedSessions} / {goal} Sessions
      </p>
    </Card>
  );
}