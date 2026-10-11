export type DashboardRange = "day" | "week" | "month" | "year";

export type ActivityKind = "focus" | "meeting" | "break";

export interface ActivityHistoryItem {
  id: string;
  date: string;
  duration: number;
  completedAt: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface ActivityTask {
  id: string;
  title: string;
  projectId: string | null;
  tags: string[];
  completedFocusSessions: number;
  timeSpent?: number;
}

export interface ActivityProject {
  id: string;
  name: string;
  color: string;
}

export interface ShareRow {
  id: string;
  label: string;
  seconds: number;
  percent: number;
  color: string;
}

export interface TimelineBar {
  id: string;
  kind: ActivityKind;
  left: number;
  width: number;
}

export interface TimelineColumn {
  label: string;
  focus: number;
  meeting: number;
  break: number;
}

export interface ActivitySnapshot {
  focusSeconds: number;
  meetingSeconds: number;
  breakSeconds: number;
  workSeconds: number;
  targetSeconds: number;
  percentOfTarget: number;
  focusPercent: number;
  timelineMode: "hours" | "columns";
  bars: TimelineBar[];
  columns: TimelineColumn[];
  categories: ShareRow[];
  tasks: ShareRow[];
  projects: ShareRow[];
}

export interface ActivityInput {
  anchor: Date;
  range: DashboardRange;
  history: ActivityHistoryItem[];
  events: ActivityEvent[];
  tasks: ActivityTask[];
  projects: ActivityProject[];
  focusDuration: number;
  breakDuration: number;
  dailyGoal: number;
}

const SHARE_COLORS = ["#5EEAD4", "#60A5FA", "#34D399", "#A78BFA"];
const DAY_START_HOUR = 6;
const DAY_END_HOUR = 18;

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours <= 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function splitDuration(totalSeconds: number): { hours: number; minutes: number } {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
  };
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getRange(anchor: Date, range: DashboardRange): { start: Date; end: Date } {
  if (range === "week") {
    const start = startOfDay(anchor);
    const weekday = start.getDay();
    const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
    start.setDate(start.getDate() + mondayOffset);
    const end = endOfDay(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }

  if (range === "month") {
    return {
      start: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
      end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999),
    };
  }

  if (range === "year") {
    return {
      start: new Date(anchor.getFullYear(), 0, 1),
      end: new Date(anchor.getFullYear(), 11, 31, 23, 59, 59, 999),
    };
  }

  return { start: startOfDay(anchor), end: endOfDay(anchor) };
}

export function shiftAnchor(anchor: Date, range: DashboardRange, direction: -1 | 1): Date {
  const next = new Date(anchor);
  if (range === "day") next.setDate(next.getDate() + direction);
  if (range === "week") next.setDate(next.getDate() + direction * 7);
  if (range === "month") next.setMonth(next.getMonth() + direction);
  if (range === "year") next.setFullYear(next.getFullYear() + direction);
  return next;
}

function inclusiveDays(start: Date, end: Date): number {
  const from = startOfDay(start).getTime();
  const to = startOfDay(end).getTime();
  return Math.round((to - from) / 86_400_000) + 1;
}

function inDateKeyRange(dateKey: string, start: Date, end: Date): boolean {
  return dateKey >= toDateKey(start) && dateKey <= toDateKey(end);
}

function overlaps(start: Date, end: Date, rangeStart: Date, rangeEnd: Date): boolean {
  return start < rangeEnd && end > rangeStart;
}

function clampedSeconds(start: Date, end: Date, rangeStart: Date, rangeEnd: Date): number {
  const from = Math.max(start.getTime(), rangeStart.getTime());
  const to = Math.min(end.getTime(), rangeEnd.getTime());
  return Math.max(0, (to - from) / 1000);
}

function taskSeconds(task: ActivityTask, focusDuration: number): number {
  if (task.timeSpent && task.timeSpent > 0) return task.timeSpent * 60;
  return Math.max(0, task.completedFocusSessions) * focusDuration;
}

function toShares(
  rows: Array<{ id: string; label: string; seconds: number; color?: string }>
): ShareRow[] {
  const positive = rows.filter((row) => row.seconds > 0);
  const total = positive.reduce((sum, row) => sum + row.seconds, 0);
  return positive
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 4)
    .map((row, index) => ({
      id: row.id,
      label: row.label,
      seconds: row.seconds,
      percent: total > 0 ? Math.round((row.seconds / total) * 100) : 0,
      color: row.color ?? SHARE_COLORS[index % SHARE_COLORS.length],
    }));
}

function hourBars(
  anchor: Date,
  history: ActivityHistoryItem[],
  events: ActivityEvent[],
  breakDuration: number
): TimelineBar[] {
  const windowStart = new Date(anchor);
  windowStart.setHours(DAY_START_HOUR, 0, 0, 0);
  const windowEnd = new Date(anchor);
  windowEnd.setHours(DAY_END_HOUR, 0, 0, 0);
  const span = windowEnd.getTime() - windowStart.getTime();
  const bars: TimelineBar[] = [];

  const place = (id: string, kind: ActivityKind, start: Date, end: Date) => {
    const from = Math.max(start.getTime(), windowStart.getTime());
    const to = Math.min(end.getTime(), windowEnd.getTime());
    if (to <= from || span <= 0) return;
    bars.push({
      id,
      kind,
      left: ((from - windowStart.getTime()) / span) * 100,
      width: Math.max(((to - from) / span) * 100, 0.6),
    });
  };

  history.forEach((item) => {
    const end = new Date(item.completedAt);
    if (Number.isNaN(end.getTime())) return;
    const start = new Date(end.getTime() - item.duration * 1000);
    place(`${item.id}-focus`, "focus", start, end);
    const breakEnd = new Date(end.getTime() + breakDuration * 1000);
    place(`${item.id}-break`, "break", end, breakEnd);
  });

  events
    .filter((event) => event.type === "meeting")
    .forEach((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
      place(event.id, "meeting", start, end);
    });

  return bars;
}

function columnLabel(date: Date, range: DashboardRange): string {
  if (range === "year") {
    return date.toLocaleDateString("en-US", { month: "narrow" });
  }
  if (range === "week") {
    return date.toLocaleDateString("en-US", { weekday: "narrow" });
  }
  return String(date.getDate());
}

function buildYearColumns(
  year: number,
  history: ActivityHistoryItem[],
  events: ActivityEvent[],
  breakDuration: number
): TimelineColumn[] {
  const months: TimelineColumn[] = Array.from({ length: 12 }, (_, month) => ({
    label: new Date(year, month, 1).toLocaleDateString("en-US", { month: "narrow" }),
    focus: 0,
    meeting: 0,
    break: 0,
  }));

  history.forEach((item) => {
    const month = Number(item.date.slice(5, 7)) - 1;
    if (month < 0 || month > 11) return;
    months[month].focus += item.duration;
    months[month].break += breakDuration;
  });

  events.forEach((event) => {
    if (event.type !== "meeting") return;
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    if (Number.isNaN(eventStart.getTime()) || Number.isNaN(eventEnd.getTime())) return;
    for (let month = 0; month < 12; month += 1) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
      months[month].meeting += clampedSeconds(eventStart, eventEnd, monthStart, monthEnd);
    }
  });

  return months;
}

function buildColumns(
  start: Date,
  end: Date,
  range: DashboardRange,
  history: ActivityHistoryItem[],
  events: ActivityEvent[],
  breakDuration: number
): TimelineColumn[] {
  if (range === "year") {
    return buildYearColumns(start.getFullYear(), history, events, breakDuration);
  }

  const columns: TimelineColumn[] = [];
  const cursor = startOfDay(start);
  const last = startOfDay(end);

  while (cursor <= last) {
    const key = toDateKey(cursor);
    const bucketEnd = endOfDay(cursor);
    let focus = 0;
    let meeting = 0;
    let breaks = 0;

    history.forEach((item) => {
      if (item.date !== key) return;
      focus += item.duration;
      breaks += breakDuration;
    });

    events.forEach((event) => {
      if (event.type !== "meeting") return;
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      if (Number.isNaN(eventStart.getTime()) || Number.isNaN(eventEnd.getTime())) return;
      meeting += clampedSeconds(eventStart, eventEnd, cursor, bucketEnd);
    });

    columns.push({
      label: columnLabel(cursor, range),
      focus,
      meeting,
      break: breaks,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return columns;
}

export function buildActivity(input: ActivityInput): ActivitySnapshot {
  const { start, end } = getRange(input.anchor, input.range);
  const history = input.history.filter((item) => inDateKeyRange(item.date, start, end));
  const meetings = input.events.filter((event) => {
    if (event.type !== "meeting") return false;
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    if (Number.isNaN(eventStart.getTime()) || Number.isNaN(eventEnd.getTime())) return false;
    return overlaps(eventStart, eventEnd, start, end);
  });

  const focusSeconds = history.reduce((sum, item) => sum + Math.max(0, item.duration), 0);
  const meetingSeconds = meetings.reduce((sum, event) => {
    return sum + clampedSeconds(new Date(event.startDate), new Date(event.endDate), start, end);
  }, 0);
  const breakSeconds = history.length * Math.max(0, input.breakDuration);
  const workSeconds = focusSeconds + meetingSeconds;
  const targetSeconds = Math.max(1, input.dailyGoal) * Math.max(1, input.focusDuration) * inclusiveDays(start, end);
  const tracked = focusSeconds + meetingSeconds + breakSeconds;

  const categoryMap = new Map<string, number>();
  const projectMap = new Map<string, { label: string; seconds: number; color: string }>();
  const taskRows: Array<{ id: string; label: string; seconds: number }> = [];

  input.tasks.forEach((task) => {
    const seconds = taskSeconds(task, input.focusDuration);
    if (seconds <= 0) return;
    taskRows.push({ id: task.id, label: task.title, seconds });

    const tags = task.tags.length > 0 ? task.tags : ["General"];
    const share = seconds / tags.length;
    tags.forEach((tag) => {
      categoryMap.set(tag, (categoryMap.get(tag) ?? 0) + share);
    });

    if (!task.projectId) return;
    const project = input.projects.find((item) => item.id === task.projectId);
    const current = projectMap.get(task.projectId) ?? {
      label: project?.name ?? "Project",
      seconds: 0,
      color: project?.color ?? SHARE_COLORS[0],
    };
    current.seconds += seconds;
    projectMap.set(task.projectId, current);
  });

  const dayHistory = history.filter((item) => item.date === toDateKey(input.anchor));
  const dayEvents = input.events.filter((event) => {
    const eventStart = new Date(event.startDate);
    return !Number.isNaN(eventStart.getTime()) && toDateKey(eventStart) === toDateKey(input.anchor);
  });

  return {
    focusSeconds,
    meetingSeconds,
    breakSeconds,
    workSeconds,
    targetSeconds,
    percentOfTarget: Math.min(100, Math.round((workSeconds / targetSeconds) * 100)),
    focusPercent: tracked > 0 ? Math.round((focusSeconds / tracked) * 100) : 0,
    timelineMode: input.range === "day" ? "hours" : "columns",
    bars: input.range === "day" ? hourBars(input.anchor, dayHistory, dayEvents, input.breakDuration) : [],
    columns: input.range === "day" ? [] : buildColumns(start, end, input.range, history, meetings, input.breakDuration),
    categories: toShares(
      Array.from(categoryMap.entries()).map(([label, seconds]) => ({
        id: label,
        label,
        seconds,
      }))
    ),
    tasks: toShares(taskRows),
    projects: toShares(
      Array.from(projectMap.entries()).map(([id, project]) => ({
        id,
        label: project.label,
        seconds: project.seconds,
        color: project.color,
      }))
    ),
  };
}

export const HOUR_LABELS = ["6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm"];
