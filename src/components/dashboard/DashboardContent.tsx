import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiEdit2 } from "react-icons/fi";
import DayStrip from "./DayStrip";
import SessionReviewCard from "../focus/SessionReviewCard";
import AppLayout from "../../layouts/AppLayout";
import { useEventStore } from "../../store/eventStore";
import { useFocusStore } from "../../store/focusStore";
import { useProjectStore } from "../../store/projectStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTaskStore } from "../../store/taskStore";
import {
  HOUR_LABELS,
  buildActivity,
  formatDuration,
  shiftAnchor,
  splitDuration,
  toDateKey,
  type ActivityKind,
  type DashboardRange,
  type ShareRow,
} from "../../utils/activity";

const RANGES: DashboardRange[] = ["day", "week", "month", "year"];

const KIND_COLOR: Record<ActivityKind, string> = {
  focus: "#7AF0FF",
  meeting: "#60A5FA",
  break: "#34D399",
};

function greetingFor(date: Date, name: string): string {
  const hour = date.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name.trim() ? `${hello}, ${name.trim()}` : hello;
}

function MiniRing({ percent, color }: { percent: number; color: string }) {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, percent) / 100) * circumference;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r={radius} stroke="#2a3140" strokeWidth="2.4" fill="none" />
      <circle
        cx="11"
        cy="11"
        r={radius}
        stroke={color}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 11 11)"
      />
    </svg>
  );
}

function ShareList({
  rows,
  empty,
  variant,
}: {
  rows: ShareRow[];
  empty: string;
  variant: "ring" | "bar";
}) {
  if (rows.length === 0) {
    return <p className="px-1 py-6 text-sm text-zinc-500">{empty}</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center gap-3">
          <span className="w-10 text-xs font-medium text-zinc-300">{row.percent}%</span>
          {variant === "ring" ? <MiniRing percent={row.percent} color={row.color} /> : null}
          <span className="min-w-0 flex-1 truncate text-sm text-zinc-100">{row.label}</span>
          {variant === "bar" ? (
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full" style={{ width: `${row.percent}%`, background: row.color }} />
            </span>
          ) : null}
          <span className="w-16 text-right text-xs text-zinc-400">{formatDuration(row.seconds)}</span>
          <Link to="/tasks" className="text-zinc-500 hover:text-white" aria-label={`Edit ${row.label}`}>
            <FiEdit2 className="h-3.5 w-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DailySummary({
  focus,
  meeting,
  breaks,
}: {
  focus: number;
  meeting: number;
  breaks: number;
}) {
  const total = focus + meeting + breaks;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { label: "Focus on work", value: focus, color: "#7AF0FF" },
    { label: "Meeting time", value: meeting, color: "#60A5FA" },
    { label: "Breaks", value: breaks, color: "#34D399" },
  ];
  let consumed = 0;

  return (
    <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5" aria-label="Daily summary">
      <h2 className="text-sm font-medium text-zinc-100">Daily Summary</h2>
      <div className="relative mx-auto my-4 h-52 w-52">
        <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="Focus, meetings, and breaks">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#2a3140" strokeWidth="16" strokeDasharray="4 8" />
          {total > 0
            ? segments.map((segment) => {
                const length = (segment.value / total) * circumference;
                const dashOffset = -consumed;
                consumed += length;
                return (
                  <circle
                    key={segment.label}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${length} ${circumference - length}`}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 100 100)"
                  />
                );
              })
            : null}
        </svg>
        {total === 0 ? (
          <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-xs text-zinc-500">
            No activity in this range
          </p>
        ) : null}
      </div>
      <ul className="space-y-2">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: segment.color }} />
              {segment.label}
            </span>
            <span className="text-zinc-400">{formatDuration(segment.value)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DashboardContent() {
  const history = useFocusStore((state) => state.history);
  const focusDuration = useFocusStore((state) => state.focusDuration);
  const breakDuration = useFocusStore((state) => state.breakDuration);
  const dailyGoal = useFocusStore((state) => state.dailyGoal);
  const activityLog = useFocusStore((state) => state.activityLog);
  const displayName = useSettingsStore((state) => state.displayName);
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const events = useEventStore((state) => state.events);
  const [range, setRange] = useState<DashboardRange>("day");
  const [anchor, setAnchor] = useState(() => new Date());

  const snapshot = useMemo(
    () =>
      buildActivity({
        anchor,
        range,
        history,
        events,
        tasks,
        projects,
        focusDuration,
        breakDuration,
        dailyGoal,
        activity: activityLog,
      }),
    [anchor, range, history, events, tasks, projects, focusDuration, breakDuration, dailyGoal, activityLog]
  );

  const work = splitDuration(snapshot.workSeconds);
  const viewingToday = toDateKey(anchor) === toDateKey(new Date());
  const heading = anchor.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const columnMax = Math.max(
    1,
    ...snapshot.columns.map((column) => column.focus + column.meeting + column.break)
  );

  return (
    <AppLayout>
      <div className="space-y-4 px-4 pb-6 md:px-6">
        <DayStrip />
        <SessionReviewCard />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400">
              {viewingToday ? `${greetingFor(new Date(), displayName)} ✦` : "Reviewing an earlier range"}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">{heading}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-[#1c212b] p-1" role="tablist" aria-label="Time range">
              {RANGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={range === item}
                  onClick={() => setRange(item)}
                  className={`rounded-full px-3 py-1.5 text-xs capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    range === item ? "bg-white text-[#14161c]" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c212b] text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Previous range"
                onClick={() => setAnchor((current) => shiftAnchor(current, range, -1))}
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c212b] text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Jump to today"
                onClick={() => setAnchor(new Date())}
              >
                <FiCalendar />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c212b] text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Next range"
                onClick={() => setAnchor((current) => shiftAnchor(current, range, 1))}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5">
                <h2 className="text-sm text-zinc-400">Work Hours</h2>
                <p className="mt-6 text-4xl font-semibold tracking-tight text-white">
                  {work.hours}
                  <span className="ml-1 text-2xl font-medium text-zinc-300">hr</span>
                  <span className="ml-3 text-2xl font-medium text-zinc-400">{work.minutes} min</span>
                </p>
              </section>
              <section className="rounded-[24px] bg-[#7CFFD4] p-5 text-[#10231c]">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Percent of Target</h2>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10231c]/90 text-[10px] text-[#7CFFD4]">%</span>
                </div>
                <p className="mt-5 text-5xl font-semibold tracking-tight">
                  {snapshot.percentOfTarget}%
                  <span className="ml-2 text-base font-medium">of {formatDuration(snapshot.targetSeconds)}</span>
                </p>
              </section>
              <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5">
                <h2 className="text-sm text-zinc-400">Focus Percent</h2>
                <p className="mt-6 text-5xl font-semibold tracking-tight text-white">{snapshot.focusPercent}%</p>
              </section>
            </div>

            <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5" aria-label="Timeline">
              <h2 className="text-sm font-medium text-zinc-100">Timeline</h2>
              {snapshot.timelineMode === "hours" ? (
                <div className="mt-4">
                  <div className="relative h-28 overflow-hidden rounded-2xl bg-[#141820]">
                    <div className="absolute inset-0 grid grid-cols-12">
                      {HOUR_LABELS.slice(0, 12).map((label) => (
                        <div key={label} className="border-r border-white/5" />
                      ))}
                    </div>
                    {snapshot.bars.map((bar) => (
                      <div
                        key={bar.id}
                        className="absolute bottom-3 top-3 rounded-md"
                        style={{
                          left: `${bar.left}%`,
                          width: `${bar.width}%`,
                          background:
                            bar.kind === "focus"
                              ? "linear-gradient(180deg, #9AF4FF 0%, #7AD7F5 100%)"
                              : KIND_COLOR[bar.kind],
                        }}
                        title={bar.kind}
                      />
                    ))}
                    {snapshot.bars.length === 0 ? (
                      <p className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
                        Sessions and meetings land here from 6 am to 6 pm.
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-2 grid grid-cols-7 text-[10px] text-zinc-500">
                    {["6 am", "8 am", "10 am", "12 pm", "2 pm", "4 pm", "6 pm"].map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex h-28 items-end gap-1">
                  {snapshot.columns.map((column, index) => {
                    const total = column.focus + column.meeting + column.break;
                    const height = Math.max(4, (total / columnMax) * 96);
                    return (
                      <div key={`${column.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                        <div className="flex w-full items-end justify-center" style={{ height: 96 }} title={formatDuration(total)}>
                          <div className="flex w-full max-w-3 flex-col justify-end overflow-hidden rounded-sm" style={{ height }}>
                            <div style={{ flex: column.break, background: KIND_COLOR.break }} />
                            <div style={{ flex: column.meeting, background: KIND_COLOR.meeting }} />
                            <div style={{ flex: column.focus, background: KIND_COLOR.focus }} />
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-500">{column.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
          <DailySummary focus={snapshot.focusSeconds} meeting={snapshot.meetingSeconds} breaks={snapshot.breakSeconds} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5">
            <h2 className="mb-4 text-sm font-medium text-zinc-100">Categories</h2>
            <ShareList rows={snapshot.categories} empty="Tag a task to see where your focus collects." variant="ring" />
          </section>
          <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5">
            <h2 className="mb-4 text-sm font-medium text-zinc-100">Apps</h2>
            <ShareList
              rows={snapshot.apps}
              empty="While a desktop focus session runs, the app in front is recorded here. Nothing is recorded in the browser."
              variant="ring"
            />
          </section>
          <section className="rounded-[24px] border border-white/5 bg-[#1b1f27] p-5">
            <h2 className="mb-4 text-sm font-medium text-zinc-100">Projects</h2>
            <ShareList rows={snapshot.projects} empty="Assign tasks to a project to compare them." variant="bar" />
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
