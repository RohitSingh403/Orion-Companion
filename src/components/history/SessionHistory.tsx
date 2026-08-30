// src/components/history/SessionHistory.tsx

import { FiClock, FiZap } from "react-icons/fi";
import { useFocusStore } from "../../store/focusStore";
import { useTaskStore } from "../../store/taskStore";
import { useSettingsStore } from "../../store/settingsStore";
import { Link } from "react-router-dom";

export default function SessionHistory() {
  const history = useFocusStore((s) => s.history);
  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className={`w-4 h-4 ${isDark ? "text-violet-400" : "text-violet-600"}`} />
          <h3 className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Session History</h3>
        </div>
        <Link
          to="/analytics"
          className={`text-xs hover:underline font-semibold transition-colors ${
            isDark ? "text-violet-400" : "text-violet-600"
          }`}
        >
          View all
        </Link>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className={`text-center py-10 border border-dashed rounded-xl ${
          isDark ? "border-gray-700" : "border-gray-300"
        }`}>
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>No sessions recorded yet.</p>
          <p className={`text-[10px] mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Start the timer to log your first session.
          </p>
        </div>
      ) : (
        /* Session Log rows */
        <div className="space-y-2.5 overflow-y-auto max-h-48 no-scrollbar">
          {history.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                isDark 
                  ? "bg-gray-700/50 border border-gray-700 hover:border-gray-600" 
                  : "bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Left: icon + type + task name */}
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDark 
                    ? "bg-violet-500/10 border border-violet-500/20 text-violet-400" 
                    : "bg-violet-50 border border-violet-200 text-violet-600"
                }`}>
                  <FiZap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {session.type}
                  </p>
                  {activeTask && (
                    <p className={`text-[10px] truncate max-w-[160px] ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}>
                      {activeTask.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: timestamp + duration badge */}
              <div className="flex items-center gap-3 text-right">
                <span className={`text-[10px] ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>{session.time}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                  isDark 
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/20" 
                    : "bg-violet-50 text-violet-600 border-violet-200"
                }`}>
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
