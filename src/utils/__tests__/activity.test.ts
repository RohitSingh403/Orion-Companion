import { describe, expect, it } from "vitest";
import { buildActivity, formatClock, formatDuration } from "../activity";

describe("activity formatting", () => {
  it("formats clocks and durations", () => {
    expect(formatClock(48 * 60)).toBe("48:00");
    expect(formatClock(65)).toBe("01:05");
    expect(formatDuration(7 * 3600 + 30 * 60)).toBe("7 hr 30 min");
    expect(formatDuration(45 * 60)).toBe("45 min");
  });
});

describe("buildActivity", () => {
  const anchor = new Date(2026, 4, 22, 15, 0, 0);
  const completedAt = new Date(2026, 4, 22, 10, 0, 0).toISOString();

  it("turns a focus session and a meeting into consistent day metrics", () => {
    const snapshot = buildActivity({
      anchor,
      range: "day",
      history: [
        {
          id: "session-1",
          date: "2026-05-22",
          duration: 25 * 60,
          completedAt,
        },
      ],
      events: [
        {
          id: "meet-1",
          title: "Review",
          type: "meeting",
          startDate: new Date(2026, 4, 22, 11, 0, 0).toISOString(),
          endDate: new Date(2026, 4, 22, 12, 0, 0).toISOString(),
        },
      ],
      tasks: [
        {
          id: "task-1",
          title: "Landing page",
          projectId: "project-1",
          tags: ["Design"],
          completedFocusSessions: 1,
          timeSpent: 25,
        },
      ],
      projects: [{ id: "project-1", name: "Orion", color: "#5EEAD4" }],
      activity: [],
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      dailyGoal: 8,
    });

    expect(snapshot.focusSeconds).toBe(1500);
    expect(snapshot.meetingSeconds).toBe(3600);
    expect(snapshot.breakSeconds).toBe(300);
    expect(snapshot.workSeconds).toBe(5100);
    expect(snapshot.percentOfTarget).toBe(43);
    expect(snapshot.focusPercent).toBe(28);
    expect(snapshot.bars.some((bar) => bar.kind === "focus")).toBe(true);
    expect(snapshot.categories[0]?.label).toBe("Design");
    expect(snapshot.projects[0]?.label).toBe("Orion");
    expect(snapshot.apps).toHaveLength(0);
  });

  it("sums recorded foreground apps inside the selected range", () => {
    const snapshot = buildActivity({
      anchor,
      range: "day",
      history: [],
      events: [],
      tasks: [],
      projects: [],
      activity: [
        { name: "Terminal", seconds: 30, date: "2026-05-22" },
        { name: "Terminal", seconds: 15, date: "2026-05-22" },
        { name: "Editor", seconds: 15, date: "2026-05-21" },
      ],
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      dailyGoal: 8,
    });

    expect(snapshot.apps).toEqual([
      expect.objectContaining({ label: "Terminal", seconds: 45, percent: 100 }),
    ]);
  });

  it("returns an empty day without inventing activity", () => {
    const snapshot = buildActivity({
      anchor,
      range: "day",
      history: [],
      events: [],
      tasks: [],
      projects: [],
      activity: [],
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      dailyGoal: 8,
    });

    expect(snapshot.workSeconds).toBe(0);
    expect(snapshot.percentOfTarget).toBe(0);
    expect(snapshot.focusPercent).toBe(0);
    expect(snapshot.bars).toHaveLength(0);
    expect(snapshot.tasks).toHaveLength(0);
  });
});
