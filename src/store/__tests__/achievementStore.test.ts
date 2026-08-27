// src/store/__tests__/achievementStore.test.ts

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAchievementStore } from "../achievementStore";

// Mock toastStore
vi.mock("../toastStore", () => ({
  useToastStore: {
    getState: () => ({
      showToast: vi.fn(),
    }),
  },
}));

describe("achievementStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAchievementStore.setState({
      achievements: [],
      totalXP: 0,
      level: 1,
      xpToNextLevel: 1000,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAchievementStore());

    expect(result.current.totalXP).toBe(0);
    expect(result.current.level).toBe(1);
    expect(result.current.xpToNextLevel).toBe(1000);
  });

  it("should add XP", () => {
    const { result } = renderHook(() => useAchievementStore());

    act(() => {
      result.current.addXP(500);
    });

    expect(result.current.totalXP).toBe(500);
  });

  it("should level up when reaching XP threshold", () => {
    const { result } = renderHook(() => useAchievementStore());

    act(() => {
      result.current.addXP(1000);
    });

    expect(result.current.level).toBe(2);
    expect(result.current.xpToNextLevel).toBe(1000);
  });

  it("should check if achievement is unlocked", () => {
    const { result } = renderHook(() => useAchievementStore());

    act(() => {
      result.current.addXP(1000);
    });

    expect(result.current.isUnlocked("test-id")).toBe(false);
  });

  it("should reset achievements", () => {
    const { result } = renderHook(() => useAchievementStore());

    act(() => {
      result.current.addXP(500);
    });

    act(() => {
      result.current.resetAchievements();
    });

    expect(result.current.totalXP).toBe(0);
    expect(result.current.level).toBe(1);
  });
});
