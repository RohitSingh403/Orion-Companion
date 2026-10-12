export interface CompanionSnapshot {
  remainingTime: number;
  running: boolean;
  session: "focus" | "break";
}

export interface CompanionLine {
  pose: "front" | "back";
  title: string;
  body: string;
}

export function companionMessage(snapshot: CompanionSnapshot): CompanionLine {
  const minutes = Math.max(1, Math.ceil(snapshot.remainingTime / 60));

  if (snapshot.session === "break" && snapshot.running) {
    if (snapshot.remainingTime <= 60) {
      return {
        pose: "front",
        title: "Break is ending",
        body: "Come back when you are ready for the next block.",
      };
    }
    return {
      pose: "front",
      title: "Take a break",
      body: "Stand up, stretch, and leave the screen for a minute.",
    };
  }

  if (snapshot.session === "break") {
    return {
      pose: "front",
      title: "Break is paused",
      body: "The break is waiting. Resume it when you want.",
    };
  }

  if (snapshot.running) {
    if (snapshot.remainingTime <= 60) {
      return {
        pose: "back",
        title: "Last minute",
        body: "Finish the thought you are on.",
      };
    }
    if (snapshot.remainingTime <= 5 * 60) {
      return {
        pose: "back",
        title: "Almost there",
        body: `${minutes} minutes left in this focus block.`,
      };
    }
    return {
      pose: "back",
      title: "Focus is on",
      body: `${minutes} minutes left. Stay with this block.`,
    };
  }

  return {
    pose: "front",
    title: "Waiting",
    body: "Start a focus block when you want.",
  };
}
