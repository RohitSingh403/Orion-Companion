import { useState } from "react";
import { useFocusStore } from "../../store/focusStore";
import { useDayStore, intentionFor } from "../../store/dayStore";
import { useReminderStore } from "../../store/reminderStore";
import { useTaskStore } from "../../store/taskStore";
import { buildDayLog } from "../../utils/dayLoop";
import { getTodayString } from "../../utils/date";

export default function DayStrip() {
  const today = getTodayString();
  const intentionDate = useDayStore((state) => state.intentionDate);
  const storedIntention = useDayStore((state) => state.intention);
  const setIntention = useDayStore((state) => state.setIntention);
  const logs = useDayStore((state) => state.logs);
  const saveDay = useDayStore((state) => state.saveDay);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const intention = intentionFor(today, intentionDate, storedIntention);
  const restDates = useFocusStore((state) => state.restDates);
  const toggleRestDay = useFocusStore((state) => state.toggleRestDay);
  const history = useFocusStore((state) => state.history);
  const tasks = useTaskStore((state) => state.tasks);
  const reminders = useReminderStore((state) => state.reminders);
  const resting = restDates.includes(today);

  const saveLog = () => {
    const note = buildDayLog({
      date: today,
      intention,
      rest: resting,
      sessions: history
        .filter((item) => item.date === today)
        .map((item) => ({
          time: item.time,
          minutes: Math.round(item.duration / 60),
          taskTitle: item.taskTitle,
          note: item.note,
        })),
      tasks: tasks.map((task) => ({
        title: task.title,
        completed: task.completed,
        estimated: task.estimatedFocusSessions,
        done: task.completedFocusSessions,
      })),
      reminders: reminders.map((reminder) => ({ title: reminder.title, status: reminder.status })),
    });
    saveDay(today, note);
    const blob = new Blob([note], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orion-${today}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#1b1f27] p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]" htmlFor="today-intention">
            Today
          </label>
          <input
            id="today-intention"
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
            placeholder="One line for this day"
            className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121418] px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={resting}
            onClick={() => toggleRestDay(today)}
            className={`rounded-full px-3 py-2 text-xs font-semibold ${
              resting ? "bg-[#7CFFD4] text-[#14161c]" : "border border-white/10 text-zinc-200"
            }`}
          >
            {resting ? "Rest day" : "Mark rest"}
          </button>
          <button
            type="button"
            onClick={saveLog}
            className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200"
          >
            Save today's note
          </button>
        </div>
      </div>
      {logs.length > 0 ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">Saved days</p>
          <ul className="mt-2 space-y-2">
            {logs.map((log) => (
              <li key={log.date}>
                <button
                  type="button"
                  aria-expanded={openDate === log.date}
                  onClick={() => setOpenDate(openDate === log.date ? null : log.date)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-200"
                >
                  {log.date}
                </button>
                {openDate === log.date ? (
                  <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-[#121418] p-3 text-xs leading-relaxed text-zinc-300">
                    {log.markdown}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
