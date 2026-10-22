export interface AppSample {
  name: string;
  seconds: number;
}

export function gapIsRest(last: string, today: string, restDates: readonly string[]) {
  if (!last || !today || last >= today) return false;
  const cursor = parseKey(last);
  const end = parseKey(today);
  cursor.setDate(cursor.getDate() + 1);
  const rest = new Set(restDates);
  while (cursor < end) {
    if (!rest.has(formatKey(cursor))) return false;
    cursor.setDate(cursor.getDate() + 1);
  }
  return true;
}

function parseKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
}

function formatKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isLongBreak(completedSessions: number, every: number) {
  if (every <= 0) return false;
  return completedSessions > 0 && completedSessions % every === 0;
}

export function breakCard(completedSessions: number) {
  const cards = [
    "Drink a glass of water before you sit again.",
    "Stretch your shoulders and stand up.",
    "Look at something far away for a moment.",
  ];
  const index = Math.max(0, completedSessions - 1) % cards.length;
  return cards[index];
}

export function interruptionNames(samples: readonly AppSample[], allowed: readonly string[]) {
  const allow = allowed.map((name) => name.trim().toLowerCase()).filter(Boolean);
  return samples
    .filter((sample) => sample.seconds > 0 && sample.name.trim())
    .filter((sample) => {
      const name = sample.name.toLowerCase();
      return !allow.some((item) => name.includes(item) || item.includes(name));
    })
    .sort((a, b) => b.seconds - a.seconds)
    .map((sample) => sample.name);
}

export interface OpenTask {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const RANK = { high: 0, medium: 1, low: 2 };

export function nextOpenTask(tasks: readonly OpenTask[], activeId: string | null) {
  const active = tasks.find((task) => task.id === activeId && !task.completed && task.title.trim());
  if (active) return { id: active.id, title: active.title.trim() };
  const next = tasks
    .filter((task) => !task.completed && task.title.trim())
    .sort((a, b) => RANK[a.priority] - RANK[b.priority] || a.createdAt.localeCompare(b.createdAt))[0];
  return next ? { id: next.id, title: next.title.trim() } : null;
}

export interface PlannedEvent {
  title: string;
  taskId?: string | null;
  type: string;
  startDate: string;
}

export function plannedFocus(events: readonly PlannedEvent[], now: number) {
  const windowMs = 5 * 60 * 1000;
  const match = events
    .map((event) => ({ event, start: Date.parse(event.startDate) }))
    .filter((item) => item.event.type === "focus" && Number.isFinite(item.start))
    .filter((item) => item.start >= now - 60_000 && item.start <= now + windowMs)
    .sort((a, b) => a.start - b.start)[0];
  if (!match) return null;
  return {
    title: match.event.title,
    taskId: match.event.taskId ?? null,
    minutesUntil: Math.max(0, Math.ceil((match.start - now) / 60000)),
  };
}

export function nextHourPlan(now: Date, minutes: number) {
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + Math.max(1, minutes) * 60_000);
  return { start: start.toISOString(), end: end.toISOString() };
}

export const WORK_TEMPLATES = [
  { id: "study", label: "Study", minutes: 50, sessions: 2, steps: ["Read the section", "Write what you remember"] },
  { id: "writing", label: "Writing", minutes: 25, sessions: 1, steps: ["Draft the next part", "Read it once"] },
  { id: "meeting", label: "Meeting prep", minutes: 15, sessions: 1, steps: ["Name the outcome", "Write the questions"] },
] as const;

export interface DayLogInput {
  date: string;
  intention: string;
  rest: boolean;
  sessions: Array<{ time: string; minutes: number; taskTitle?: string; note?: string }>;
  tasks: Array<{ title: string; completed: boolean; estimated: number; done: number }>;
  reminders: Array<{ title: string; status: string }>;
}

export function buildDayLog(input: DayLogInput) {
  const lines = [`# ${input.date}`, "", input.intention.trim() || "No intention written."];
  if (input.rest) lines.push("", "This day is marked as rest.");
  lines.push("", "## Sessions");
  if (input.sessions.length === 0) lines.push("No focus blocks.");
  input.sessions.forEach((session) => {
    const task = session.taskTitle ? ` — ${session.taskTitle}` : "";
    lines.push(`- ${session.time}: ${session.minutes} min${task}`);
    if (session.note?.trim()) lines.push(`  ${session.note.trim()}`);
  });
  lines.push("", "## Tasks");
  const finished = input.tasks.filter((task) => task.completed);
  const open = input.tasks.filter((task) => !task.completed && task.done > 0);
  if (finished.length === 0 && open.length === 0) lines.push("No task progress.");
  finished.forEach((task) => lines.push(`- Finished ${task.title} (${task.done}/${task.estimated} sessions)`));
  open.forEach((task) => lines.push(`- ${task.title}: ${task.done} of ${task.estimated} sessions`));
  lines.push("", "## Reminders");
  const cleared = input.reminders.filter((reminder) => reminder.status === "completed");
  if (cleared.length === 0) lines.push("None cleared.");
  cleared.forEach((reminder) => lines.push(`- ${reminder.title}`));
  lines.push("");
  return lines.join("\n");
}
