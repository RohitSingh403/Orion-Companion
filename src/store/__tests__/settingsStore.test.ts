// src/store/__tests__/settingsStore.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettingsStore } from "../settingsStore";

describe("settingsStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useSettingsStore.setState({
      focusMinutes: 25,
      breakMinutes: 5,
      dailyGoal: 8,
      autoStartBreak: false,
      autoStartFocus: false,
      soundEnabled: true,
      breakSound: "break.mp3",
      focusSound: "complete.mp3",
      desktopNotifications: true,
      breakReminder: true,
      theme: "dark",
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSettingsStore());

    expect(result.current.focusMinutes).toBe(25);
    expect(result.current.breakMinutes).toBe(5);
    expect(result.current.dailyGoal).toBe(8);
    expect(result.current.soundEnabled).toBe(true);
    expect(result.current.theme).toBe("dark");
  });

  it("should set focus minutes", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setFocusMinutes(30);
    });

    expect(result.current.focusMinutes).toBe(30);
  });

  it("should set break minutes", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setBreakMinutes(10);
    });

    expect(result.current.breakMinutes).toBe(10);
  });

  it("should set daily goal", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setDailyGoal(10);
    });

    expect(result.current.dailyGoal).toBe(10);
  });

  it("should set auto start break", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setAutoStartBreak(true);
    });

    expect(result.current.autoStartBreak).toBe(true);
  });

  it("should set auto start focus", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setAutoStartFocus(true);
    });

    expect(result.current.autoStartFocus).toBe(true);
  });

  it("should toggle sound", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.soundEnabled).toBe(false);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.soundEnabled).toBe(true);
  });

  it("should set break sound", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setBreakSound("bell.mp3");
    });

    expect(result.current.breakSound).toBe("bell.mp3");
  });

  it("should set focus sound", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setFocusSound("motivation.mp3");
    });

    expect(result.current.focusSound).toBe("motivation.mp3");
  });

  it("should set desktop notifications", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setDesktopNotifications(false);
    });

    expect(result.current.desktopNotifications).toBe(false);
  });

  it("should set break reminder", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setBreakReminder(false);
    });

    expect(result.current.breakReminder).toBe(false);
  });

  it("should set theme", () => {
    const { result } = renderHook(() => useSettingsStore());

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
  });
});
