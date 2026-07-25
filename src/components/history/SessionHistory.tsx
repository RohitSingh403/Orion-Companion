import Card from "../ui/Card";
import { FaHistory, FaCheckCircle } from "react-icons/fa";

import { useFocusStore } from "../../store/focusStore";

export default function SessionHistory() {
  const history = useFocusStore((state) => state.history);

  return (
    <Card className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaHistory className="text-emerald-400 text-xl" />

        <div>
          <h2 className="text-xl font-bold">
            Session History
          </h2>

          <p className="text-sm text-zinc-400">
            Today's completed focus sessions
          </p>
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-zinc-500">
          No sessions completed yet.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => (
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
                  <p className="font-medium">
                    {session.type}
                  </p>

                  <p className="text-xs text-zinc-400">
                    {session.time}
                  </p>
                </div>
              </div>

              <span className="text-xs text-emerald-400">
                Completed
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}