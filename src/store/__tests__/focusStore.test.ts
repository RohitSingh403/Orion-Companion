// src/store/__tests__/focusStore.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFocusStore } from "../focusStore";
import { getYesterdayString } from "../../utils/date";

describe("focusStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useFocusStore.setState({
      session: "focus",
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      dailyGoal: 8,
      remainingTime: 25 * 60,
      running: false,
      completedSessions: 0,
      history: [],
      currentStreak: 0,
      lastCompletedDate: null,
      bestStreak: 0,
      dailyStats: [],
      longBreakDuration: 15 * 60,
      sessionsBeforeLongBreak: 4,
      breakKind: "short",
      sessionReview: null,
      sessionApps: [],
      restDates: [],
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useFocusStore());

    expect(result.current.running).toBe(false);
    expect(result.current.session).toBe("focus");
    expect(result.current.completedSessions).toBe(0);
  });

  it("should start timer", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      result.current.start();
    });

    expect(result.current.running).toBe(true);
  });

  it("should pause timer", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      result.current.start();
      result.current.pause();
    });

    expect(result.current.running).toBe(false);
  });

  it("should reset timer", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      result.current.start();
      result.current.reset();
    });

    expect(result.current.running).toBe(false);
    expect(result.current.remainingTime).toBe(25 * 60);
  });

  it("should set focus duration", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      result.current.setFocusDuration(30);
    });

    expect(result.current.focusDuration).toBe(30 * 60);
  });

  it("should set break duration", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      result.current.setBreakDuration(10);
    });

    expect(result.current.breakDuration).toBe(10 * 60);
  });

  it("should set daily goal", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      result.current.setDailyGoal(10);
    });

    expect(result.current.dailyGoal).toBe(10);
  });

  it("opens a review and takes a long break on the fourth block", () => {
    const { result } = renderHook(() => useFocusStore());

    act(() => {
      useFocusStore.setState({
        running: true,
        session: "focus",
        remainingTime: 1,
        completedSessions: 3,
        sessionApps: [{ name: "Mail", seconds: 12 }],
      });
      result.current.tick();
    });

    expect(result.current.session).toBe("break");
    expect(result.current.breakKind).toBe("long");
    expect(result.current.remainingTime).toBe(15 * 60);
    expect(result.current.sessionReview?.apps[0]?.name).toBe("Mail");
    expect(result.current.history[0]?.note).toBe("");

    act(() => {
      result.current.settleReview("Outline done");
    });

    expect(result.current.sessionReview).toBeNull();
    expect(result.current.history[0]?.note).toBe("Outline done");
  });

  it("keeps the streak across a marked rest day", () => {
    const { result } = renderHook(() => useFocusStore());
    const older = new Date();
    older.setDate(older.getDate() - 2);

    act(() => {
      result.current.toggleRestDay(getYesterdayString());
      useFocusStore.setState({
        running: true,
        session: "focus",
        remainingTime: 1,
        completedSessions: 0,
        currentStreak: 3,
        lastCompletedDate: older.toLocaleDateString("en-CA"),
      });
      result.current.tick();
    });

    expect(result.current.currentStreak).toBe(4);
  });
});
