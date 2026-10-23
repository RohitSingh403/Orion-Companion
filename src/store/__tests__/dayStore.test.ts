import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { checksFor, useDayStore } from "../dayStore";

describe("dayStore", () => {
  beforeEach(() => {
    useDayStore.setState({
      intentionDate: "",
      intention: "",
      captures: [],
      allowedApps: ["Code"],
      breakCheckDate: "",
      breakChecks: { water: false, stretch: false, look: false },
      logs: [],
    });
  });

  it("ticks a break step and starts a new day unchecked", () => {
    const { result } = renderHook(() => useDayStore());

    act(() => {
      result.current.toggleBreakCheck("water");
    });

    expect(result.current.breakChecks.water).toBe(true);
    expect(checksFor("2000-01-01", result.current.breakCheckDate, result.current.breakChecks).water).toBe(false);
  });

  it("keeps one saved note per day", () => {
    const { result } = renderHook(() => useDayStore());

    act(() => {
      result.current.saveDay("2026-10-22", "# 2026-10-22\n\nFirst");
      result.current.saveDay("2026-10-23", "# 2026-10-23\n\nToday");
      result.current.saveDay("2026-10-23", "# 2026-10-23\n\nRewritten");
    });

    expect(result.current.logs.map((log) => log.date)).toEqual(["2026-10-23", "2026-10-22"]);
    expect(result.current.logs[0]?.markdown).toContain("Rewritten");
  });
});
