import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

export type DemoView = "day" | "timer" | "tasks" | "notes";

interface ProductDemoProps {
  view: DemoView;
  onViewChange: (view: DemoView) => void;
}

type Range = "Day" | "Week" | "Month";
type Scene = "Coffee Shop" | "Rain" | "Night";
type Sample = "Deep work" | "Meeting day" | "Study block";

interface TaskItem {
  id: string;
  title: string;
  done: boolean;
}

interface NoteItem {
  id: string;
  title: string;
}

const VIEWS: { id: DemoView; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "timer", label: "Timer" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
];

const LENGTHS = [
  { label: "15", seconds: 15 * 60 },
  { label: "25", seconds: 25 * 60 },
  { label: "50", seconds: 50 * 60 },
];

const SCENES: Scene[] = ["Coffee Shop", "Rain", "Night"];
const SAMPLES: Sample[] = ["Deep work", "Meeting day", "Study block"];

const STATS: Record<Sample, Record<Range, { work: string; target: string; focus: string; seed: number }>> = {
  "Deep work": {
    Day: { work: "6 hr 15 min", target: "83%", focus: "91%", seed: 3 },
    Week: { work: "28 hr", target: "80%", focus: "86%", seed: 5 },
    Month: { work: "96 hr", target: "74%", focus: "82%", seed: 8 },
  },
  "Meeting day": {
    Day: { work: "4 hr 10 min", target: "55%", focus: "38%", seed: 11 },
    Week: { work: "18 hr", target: "51%", focus: "42%", seed: 13 },
    Month: { work: "70 hr", target: "54%", focus: "45%", seed: 17 },
  },
  "Study block": {
    Day: { work: "5 hr", target: "100%", focus: "88%", seed: 19 },
    Week: { work: "22 hr", target: "92%", focus: "84%", seed: 23 },
    Month: { work: "80 hr", target: "88%", focus: "80%", seed: 29 },
  },
};

const SCENE_TINT: Record<Scene, string> = {
  "Coffee Shop": "rgba(122,215,245,0.14)",
  Rain: "rgba(96,165,250,0.16)",
  Night: "rgba(52,211,153,0.12)",
};

function bars(seed: number) {
  return Array.from({ length: 12 }, (_, index) => 22 + ((seed * (index + 3) * 17) % 64));
}

function clock(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ProductDemo({ view, onViewChange }: ProductDemoProps) {
  const [range, setRange] = useState<Range>("Day");
  const [scene, setScene] = useState<Scene>("Coffee Shop");
  const [sample, setSample] = useState<Sample>("Deep work");
  const [length, setLength] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Preview ready");
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "outline", title: "Draft the outline", done: false },
    { id: "review", title: "Review the calendar", done: true },
    { id: "notes", title: "Write the session notes", done: false },
  ]);
  const [taskDraft, setTaskDraft] = useState("");
  const [notes, setNotes] = useState<NoteItem[]>([
    { id: "brief", title: "Keep the brief next to the task" },
  ]);
  const [noteDraft, setNoteDraft] = useState("");
  const pendingFocus = useRef<DemoView | null>(null);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      setRemaining((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && running) {
      setRunning(false);
      setStatus("Preview session complete");
    }
  }, [remaining, running]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    document.getElementById(`demo-tab-${pendingFocus.current}`)?.focus();
    pendingFocus.current = null;
  }, [view]);

  const stats = STATS[sample][range];
  const doneCount = tasks.filter((task) => task.done).length;
  const activeIndex = VIEWS.findIndex((item) => item.id === view);

  function chooseLength(seconds: number) {
    setLength(seconds);
    setRemaining(seconds);
    setRunning(false);
    setStatus(`${seconds / 60} minute preview ready`);
  }

  function toggleRunning() {
    if (remaining === 0) {
      setRemaining(length);
      setRunning(true);
      setStatus("Preview started");
      return;
    }
    setRunning((value) => {
      setStatus(value ? "Preview paused" : "Preview started");
      return !value;
    });
  }

  function resetTimer() {
    setRunning(false);
    setRemaining(length);
    setStatus("Preview reset");
  }

  function addTask(event: FormEvent) {
    event.preventDefault();
    const title = taskDraft.trim().slice(0, 80);
    if (!title || tasks.length >= 8) return;
    setTasks((current) => [...current, { id: `task-${current.length}-${title.length}`, title, done: false }]);
    setTaskDraft("");
    setStatus(`Added sample task ${title}`);
  }

  function addNote(event: FormEvent) {
    event.preventDefault();
    const title = noteDraft.trim().slice(0, 80);
    if (!title || notes.length >= 6) return;
    setNotes((current) => [{ id: `note-${current.length}-${title.length}`, title }, ...current]);
    setNoteDraft("");
    setStatus(`Added sample note ${title}`);
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = VIEWS[(activeIndex + direction + VIEWS.length) % VIEWS.length];
    pendingFocus.current = next.id;
    onViewChange(next.id);
  }

  return (
    <div id="preview" className="scroll-mt-24 w-full min-w-0">
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#121418]">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
          <div role="tablist" aria-label="Product preview" className="flex flex-wrap gap-1" onKeyDown={onTabKey}>
            {VIEWS.map((item) => {
              const selected = view === item.id;
              return (
                <button
                  key={item.id}
                  id={`demo-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`demo-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onViewChange(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                    selected ? "bg-white text-[#14161c]" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="hidden text-[11px] text-zinc-500 sm:block">Sample preview</p>
        </div>

        <div
          className="relative min-h-[430px] p-4 sm:p-5"
          style={{ background: `linear-gradient(180deg, ${SCENE_TINT[scene]} 0%, rgba(18,20,24,0) 42%)` }}
        >
          <p className="sr-only" aria-live="polite">{status}</p>

          {view === "day" && (
            <div role="tabpanel" id="demo-panel-day" aria-labelledby="demo-tab-day" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="rounded-full border border-white/10 bg-[#1b1f27] px-3 py-1.5 text-[11px] text-zinc-200">
                  {clock(remaining)} Focus Time Remaining
                </div>
                <div className="flex gap-1">
                  {SCENES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={scene === item}
                      onClick={() => setScene(item)}
                      className={`rounded-full px-2.5 py-1 text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                        scene === item ? "bg-[#1b1f27] text-white" : "text-zinc-500 hover:text-zinc-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {SAMPLES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={sample === item}
                    onClick={() => setSample(item)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                      sample === item ? "border-[#7CFFD4]/50 text-white" : "border-white/10 text-zinc-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-[11px] text-zinc-500">A sample {range.toLowerCase()}, not your data</p>
                <p className="mt-1 text-xl font-semibold text-white">{sample}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Work Hours" value={stats.work} />
                <Stat label="Percent of Target" value={stats.target} mint />
                <Stat label="Focus Percent" value={stats.focus} />
              </div>
              <div className="rounded-2xl bg-[#1b1f27] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] text-zinc-400">Timeline</p>
                  <div className="flex gap-1">
                    {(["Day", "Week", "Month"] as Range[]).map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={range === item}
                        onClick={() => setRange(item)}
                        className={`rounded-full px-2 py-0.5 text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                          range === item ? "bg-white text-[#14161c]" : "text-zinc-500"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex h-16 items-end gap-1">
                  {bars(stats.seed).map((height, index) => (
                    <span
                      key={`bar-${sample}-${range}-${index}`}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${height}%`,
                        background: index % 4 === 0 ? "#60A5FA" : index % 5 === 0 ? "#34D399" : "#7AF0FF",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "timer" && (
            <div role="tabpanel" id="demo-panel-timer" aria-labelledby="demo-tab-timer" className="flex h-full min-h-[390px] flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Preview session</p>
              <div className="relative mt-4 h-36 w-36">
                <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#1b1f27" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#7AD7F5"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={(2 * Math.PI * 46) * (1 - remaining / length)}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <p className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tabular-nums text-[#8AF6FF]">{clock(remaining)}</p>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{remaining === 0 ? "Session complete" : scene}</p>
              <div className="mt-4 flex gap-2">
                {LENGTHS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={length === item.seconds}
                    onClick={() => chooseLength(item.seconds)}
                    className={`rounded-full px-3 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                      length === item.seconds ? "bg-white text-[#14161c]" : "bg-[#1b1f27] text-zinc-300"
                    }`}
                  >
                    {item.label} min
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={toggleRunning}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                >
                  {running ? "Pause preview" : "Start preview"}
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                >
                  Reset preview
                </button>
              </div>
            </div>
          )}

          {view === "tasks" && (
            <div role="tabpanel" id="demo-panel-tasks" aria-labelledby="demo-tab-tasks">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-zinc-500">Sample list</p>
                  <p className="text-xl font-semibold text-white">Today</p>
                </div>
                <p className="text-sm text-zinc-400">{doneCount}/{tasks.length} done</p>
              </div>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#1b1f27]">
                <div
                  className="h-full rounded-full bg-[#7CFFD4]"
                  style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }}
                />
              </div>
              <ul className="max-h-52 space-y-2 overflow-y-auto">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      aria-pressed={task.done}
                      onClick={() => setTasks((current) => current.map((item) => (
                        item.id === task.id ? { ...item, done: !item.done } : item
                      )))}
                      className="flex w-full items-center gap-3 rounded-2xl bg-[#1b1f27] px-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                    >
                      <span className={`h-4 w-4 shrink-0 rounded-full border ${task.done ? "border-[#7CFFD4] bg-[#7CFFD4]" : "border-white/20"}`} />
                      <span className={task.done ? "text-zinc-500 line-through" : "text-zinc-100"}>{task.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={addTask} className="mt-3 flex gap-2">
                <label className="sr-only" htmlFor="sample-task">Add a sample task</label>
                <input
                  id="sample-task"
                  value={taskDraft}
                  onChange={(event) => setTaskDraft(event.target.value)}
                  placeholder="Add a sample task"
                  maxLength={80}
                  className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#1b1f27] px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                >
                  Add
                </button>
              </form>
            </div>
          )}

          {view === "notes" && (
            <div role="tabpanel" id="demo-panel-notes" aria-labelledby="demo-tab-notes">
              <p className="text-[11px] text-zinc-500">Sample notes stay in this preview</p>
              <p className="mt-1 text-xl font-semibold text-white">Scratch pad</p>
              <form onSubmit={addNote} className="mt-4 flex gap-2">
                <label className="sr-only" htmlFor="sample-note">Add a sample note</label>
                <input
                  id="sample-note"
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="Add a sample note"
                  maxLength={80}
                  className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#1b1f27] px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                >
                  Save
                </button>
              </form>
              <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-2xl bg-[#1b1f27] px-4 py-3 text-sm text-zinc-100">
                    {note.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-zinc-500">
        This preview runs in the page. It does not change the companion on this computer.
      </p>
    </div>
  );
}

function Stat({ label, value, mint = false }: { label: string; value: string; mint?: boolean }) {
  return (
    <div className={`min-w-0 rounded-2xl p-3 ${mint ? "bg-[#7CFFD4] text-[#10231c]" : "bg-[#1b1f27]"}`}>
      <p className={`truncate text-[10px] ${mint ? "font-medium" : "text-zinc-500"}`}>{label}</p>
      <p className={`mt-2 truncate text-sm font-semibold ${mint ? "" : "text-white"}`}>{value}</p>
    </div>
  );
}
