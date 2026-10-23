import { useDayStore, checksFor } from "../../store/dayStore";
import { BREAK_STEPS } from "../../utils/dayLoop";
import { getTodayString } from "../../utils/date";

export default function BreakChecklist({ compact = false }: { compact?: boolean }) {
  const today = getTodayString();
  const breakCheckDate = useDayStore((state) => state.breakCheckDate);
  const stored = useDayStore((state) => state.breakChecks);
  const toggleBreakCheck = useDayStore((state) => state.toggleBreakCheck);
  const checks = checksFor(today, breakCheckDate, stored);

  return (
    <section className={compact ? "mt-2" : "rounded-2xl border border-white/10 bg-[#1b1f27] p-4"}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">Break</p>
      {!compact ? <p className="mt-1 text-sm text-zinc-400">Tick each one before you sit again.</p> : null}
      <ul className={`flex flex-wrap gap-2 ${compact ? "mt-1" : "mt-3"}`}>
        {BREAK_STEPS.map((step) => {
          const done = checks[step.id];
          return (
            <li key={step.id}>
              <button
                type="button"
                aria-pressed={done}
                onClick={() => toggleBreakCheck(step.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  done ? "bg-[#7CFFD4] text-[#14161c]" : "border border-white/10 text-zinc-200"
                }`}
              >
                {done ? `${step.label} done` : step.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
