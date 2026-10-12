export interface CompanionSnapshot {
  remainingTime: number;
  running: boolean;
  session: "focus" | "break";
}

export interface CompanionLine {
  mode: "idle" | "focus" | "break";
  title: string;
  body: string;
}

export function companionMessage(snapshot: CompanionSnapshot): CompanionLine {
  const minutes = Math.max(1, Math.ceil(snapshot.remainingTime / 60));

  if (snapshot.session === "break" && snapshot.running) {
    if (snapshot.remainingTime <= 60) {
      return {
        mode: "break",
        title: "Break is ending",
        body: "Finish the coffee. The next block is close.",
      };
    }
    return {
      mode: "break",
      title: "Coffee break",
      body: "Step away from the laptop. The mug is yours for a few minutes.",
    };
  }

  if (snapshot.session === "break") {
    return {
      mode: "break",
      title: "Break is paused",
      body: "The coffee is waiting. Resume the break when you want.",
    };
  }

  if (snapshot.running) {
    if (snapshot.remainingTime <= 60) {
      return {
        mode: "focus",
        title: "Last minute",
        body: "One more line, then close the laptop.",
      };
    }
    if (snapshot.remainingTime <= 5 * 60) {
      return {
        mode: "focus",
        title: "Almost there",
        body: `${minutes} minutes left. Keep typing.`,
      };
    }
    return {
      mode: "focus",
      title: "Focus is on",
      body: `${minutes} minutes left. Working through this block.`,
    };
  }

  return {
    mode: "idle",
    title: "Waiting",
    body: "Start a focus block when you want.",
  };
}
