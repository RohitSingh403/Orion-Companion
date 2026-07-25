import Card from "../ui/Card";
import { FaHistory, FaCheckCircle } from "react-icons/fa";

export default function SessionHistory() {
  // Temporary dummy data
  const sessions = [
    {
      id: 1,
      time: "09:15 AM",
      type: "Focus Session",
    },
    {
      id: 2,
      time: "10:00 AM",
      type: "Focus Session",
    },
    {
      id: 3,
      time: "11:05 AM",
      type: "Focus Session",
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <FaHistory className="text-emerald-400 text-xl" />

        <div>
          <h2 className="text-xl font-bold">Session History</h2>

          <p className="text-sm text-zinc-400">
            Today's completed focus sessions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              bg-zinc-800/60
              px-4
              py-3
            "
          >
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-400" />

              <div>
                <p className="font-medium">{session.type}</p>

                <p className="text-xs text-zinc-400">{session.time}</p>
              </div>
            </div>

            <span className="text-xs text-emerald-400">Completed</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
