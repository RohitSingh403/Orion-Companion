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
      <h2 className="text-lg font-semibold mb-5">
        📊 Today's Progress
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-zinc-800 p-4 text-center">
          <p className="text-3xl font-bold text-green-400">
            {completedSessions}
          </p>

          <p className="text-sm text-zinc-400 mt-2">
            Sessions
          </p>
        </div>

        <div className="rounded-xl bg-zinc-800 p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">
            {focusMinutes}
          </p>

          <p className="text-sm text-zinc-400 mt-2">
            Minutes
          </p>
        </div>

      </div>
    </Card>
  );
}