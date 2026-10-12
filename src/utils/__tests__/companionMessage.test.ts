import { describe, expect, it } from "vitest";
import { companionMessage } from "../companionMessage";

describe("companionMessage", () => {
  it("asks for a break while a break is running", () => {
    expect(companionMessage({ remainingTime: 180, running: true, session: "break" })).toMatchObject({
      mode: "break",
      title: "Coffee break",
    });
  });

  it("works at the laptop during focus and warns in the last minute", () => {
    expect(companionMessage({ remainingTime: 20 * 60, running: true, session: "focus" })).toMatchObject({
      mode: "focus",
      title: "Focus is on",
    });
    expect(companionMessage({ remainingTime: 45, running: true, session: "focus" })).toMatchObject({
      mode: "focus",
      title: "Last minute",
    });
  });

  it("waits without a running session", () => {
    expect(companionMessage({ remainingTime: 25 * 60, running: false, session: "focus" })).toMatchObject({
      mode: "idle",
      title: "Waiting",
    });
  });
});
