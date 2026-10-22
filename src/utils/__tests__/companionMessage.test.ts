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

  it("puts a due reminder on the board and previews one that is close", () => {
    const now = Date.parse("2026-10-18T12:00:00");
    const due = {
      id: "stretch",
      title: "Stand up",
      status: "pending",
      dueDate: "2026-10-18T11:50:00",
    };
    expect(companionMessage({ remainingTime: 20 * 60, running: true, session: "focus" }, [due], now)).toMatchObject({
      mode: "focus",
      title: "Reminder",
      body: "Stand up",
      reminderId: "stretch",
    });

    const soon = {
      title: "Call home",
      status: "pending",
      dueDate: "2026-10-18T12:10:00",
    };
    expect(companionMessage({ remainingTime: 25 * 60, running: false, session: "focus" }, [soon], now)).toMatchObject({
      mode: "idle",
      title: "Coming up",
      body: "Call home in 10 minutes.",
    });
  });

  it("names the next task, a long break, and a finished block", () => {
    expect(
      companionMessage({ remainingTime: 25 * 60, running: false, session: "focus" }, [], Date.now(), {
        nextTaskTitle: "Write the chapter",
      })
    ).toMatchObject({ title: "Next", body: "Write the chapter" });

    expect(
      companionMessage({ remainingTime: 15 * 60, running: true, session: "break" }, [], Date.now(), {
        breakKind: "long",
      })
    ).toMatchObject({ title: "Long break" });

    expect(
      companionMessage({ remainingTime: 5 * 60, running: true, session: "break" }, [], Date.now(), {
        reviewTask: "Chapter",
      })
    ).toMatchObject({ title: "Block finished", review: true });
  });
});
