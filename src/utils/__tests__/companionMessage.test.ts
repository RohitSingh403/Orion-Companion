import { describe, expect, it } from "vitest";
import { companionMessage } from "../companionMessage";

describe("companionMessage", () => {
  it("asks for a break while a break is running", () => {
    expect(companionMessage({ remainingTime: 180, running: true, session: "break" })).toMatchObject({
      pose: "front",
      title: "Take a break",
    });
  });

  it("turns away during a focus block and warns in the last minute", () => {
    expect(companionMessage({ remainingTime: 20 * 60, running: true, session: "focus" }).title).toBe("Focus is on");
    expect(companionMessage({ remainingTime: 45, running: true, session: "focus" })).toMatchObject({
      pose: "back",
      title: "Last minute",
    });
  });

  it("waits without a running session", () => {
    expect(companionMessage({ remainingTime: 25 * 60, running: false, session: "focus" })).toMatchObject({
      pose: "front",
      title: "Waiting",
    });
  });
});
