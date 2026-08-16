// src/components/history/SessionHistory.tsx

import { FiClock, FiZap } from "react-icons/fi";
import { useFocusStore } from "../../store/focusStore";
import { useTaskStore } from "../../store/taskStore";
import { Link } from "react-router-dom";

export default function SessionHistory() {
  const history = useFocusStore((s) => s.history);
  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-primary">Session History</h3>
        </div>
        <Link
          to="/analytics"
          className="text-xs text-accent hover:underline font-semibold"
        >
          View all
        </Link>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-muted">No sessions recorded yet.</p>
          <p className="text-[10px] text-muted mt-1">
            Start the timer to log your first session.
          </p>
        </div>
      ) : (
        /* Session Log rows */
        <div className="space-y-2.5 overflow-y-auto max-h-48 no-scrollbar">
          {history.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition"
            >
              {/* Left: icon + type + task name */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  <FiZap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {session.type}
                  </p>
                  {activeTask && (
                    <p className="text-[10px] text-muted truncate max-w-[160px]">
                      {activeTask.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: timestamp + duration badge */}
              <div className="flex items-center gap-3 text-right">
                <span className="text-[10px] text-muted">{session.time}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-accent/10 text-accent border border-accent/20">
                  25m
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
