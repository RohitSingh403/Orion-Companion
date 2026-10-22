import { describe, expect, it } from "vitest";
import {
  breakCard,
  buildDayLog,
  buildFocusEvent,
  focusSlot,
  formatMinutes,
  fromLocalInput,
  gapIsRest,
  guessedMinutes,
  interruptionNames,
  isLongBreak,
  nextHourPlan,
  nextOpenTask,
  plannedFocus,
} from "../dayLoop";

describe("day loop", () => {
  it("keeps a streak across rest days and breaks it when a day is unmarked", () => {
    expect(gapIsRest("2026-10-16", "2026-10-19", ["2026-10-17", "2026-10-18"])).toBe(true);
    expect(gapIsRest("2026-10-16", "2026-10-19", ["2026-10-17"])).toBe(false);
    expect(gapIsRest("2026-10-18", "2026-10-19", [])).toBe(true);
  });

  it("takes a long break on every fourth finished block", () => {
    expect(isLongBreak(4, 4)).toBe(true);
    expect(isLongBreak(3, 4)).toBe(false);
    expect(breakCard(2)).toContain("Stretch");
  });

  it("lists apps that were not marked as part of the work", () => {
    expect(
      interruptionNames(
        [
          { name: "Cursor", seconds: 40 },
          { name: "Mail", seconds: 20 },
          { name: "Messages", seconds: 5 },
        ],
        ["Cursor", "Terminal"]
      )
    ).toEqual(["Mail", "Messages"]);
  });

  it("chooses the active task, then the highest priority open task", () => {
    const tasks = [
      { id: "low", title: "File", completed: false, priority: "low" as const, createdAt: "1" },
      { id: "high", title: "Ship", completed: false, priority: "high" as const, createdAt: "2" },
    ];
    expect(nextOpenTask(tasks, "low")?.title).toBe("File");
    expect(nextOpenTask(tasks, null)?.title).toBe("Ship");
  });

  it("notices a focus block that is about to start", () => {
    const now = Date.parse("2026-10-23T09:00:00");
    expect(
      plannedFocus(
        [{ title: "Write", type: "focus", taskId: "t1", startDate: "2026-10-23T09:03:00" }],
        now
      )
    ).toMatchObject({ title: "Write", taskId: "t1" });
    expect(plannedFocus([{ title: "Later", type: "focus", startDate: "2026-10-23T11:00:00" }], now)).toBeNull();
  });

  it("writes a readable day note", () => {
    const note = buildDayLog({
      date: "2026-10-23",
      intention: "Finish the chapter",
      rest: false,
      sessions: [{ time: "09:00", minutes: 25, taskTitle: "Chapter", note: "Outline done" }],
      tasks: [{ title: "Chapter", completed: false, estimated: 2, done: 1 }],
      reminders: [{ title: "Stand", status: "completed" }],
    });
    expect(note).toContain("Finish the chapter");
    expect(note).toContain("Outline done");
    expect(note).toContain("1 of 2 sessions");
    expect(note).toContain("Stand");
  });

  it("places a focus block on the chosen minute and skips the same slot", () => {
    const start = fromLocalInput("2026-10-23T14:30");
    expect(start).not.toBeNull();
    const slot = focusSlot(start!, 25);
    expect(slot?.end).toBe(new Date(start!.getTime() + 25 * 60_000).toISOString());
    const first = buildFocusEvent({
      taskId: "t1",
      title: "Chapter",
      start: start!,
      minutes: 25,
      existing: [],
    });
    expect(first?.type).toBe("focus");
    expect(
      buildFocusEvent({
        taskId: "t1",
        title: "Chapter",
        start: start!,
        minutes: 25,
        existing: [first!],
      })
    ).toBeNull();
    const hour = nextHourPlan(new Date("2026-10-23T09:20:00"), 25);
    expect(new Date(hour.start).getMinutes()).toBe(0);
  });

  it("keeps a stored hour guess and prints hours beside minutes", () => {
    expect(guessedMinutes({ estimatedMinutes: 50, estimatedFocusSessions: 1 })).toBe(50);
    expect(guessedMinutes({ estimatedFocusSessions: 2 })).toBe(50);
    expect(formatMinutes(0)).toBe("0m");
    expect(formatMinutes(90)).toBe("1h 30m");
    expect(formatMinutes(120)).toBe("2h");
  });
});
