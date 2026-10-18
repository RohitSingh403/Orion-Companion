import { beforeEach, describe, expect, it } from "vitest";
import { importBackup } from "../backup";

describe("importBackup", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores only known Orion keys", () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        "focus-companion-tasks": JSON.stringify({ state: { tasks: [] }, version: 0 }),
        "other-app": JSON.stringify({ state: {} }),
        "focus-companion-notes": "not-json",
      },
    };

    expect(importBackup(JSON.stringify(payload)).ok).toBe(true);
    expect(localStorage.getItem("focus-companion-tasks")).toContain("tasks");
    expect(localStorage.getItem("other-app")).toBeNull();
    expect(localStorage.getItem("focus-companion-notes")).toBeNull();
  });

  it("rejects a file that is not a backup", () => {
    expect(importBackup("{").ok).toBe(false);
    expect(importBackup(JSON.stringify({ version: 2, data: {} })).ok).toBe(false);
  });
});