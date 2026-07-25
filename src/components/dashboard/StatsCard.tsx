import Card from "../ui/Card";

interface StatsCardProps {
  completedSessions: number;
  focusMinutes: number;
}

export default function StatsCard({
  completedSessions,
  focusMinutes,
}: StatsCardProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-5">
        📊 Today's Stats
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-zinc-400">
            Sessions
          </span>

          <span className="font-semibold">
            {completedSessions}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Focus Time
          </span>

          <span className="font-semibold">
            {focusMinutes} min
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Productivity
          </span>

          <span className="text-green-400 font-semibold">
            Great 🚀
          </span>
        </div>
      </div>
    </Card>
  );
}