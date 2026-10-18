export interface CompanionSnapshot {
  remainingTime: number;
  running: boolean;
  session: "focus" | "break";
}

export interface CompanionLine {
  mode: "idle" | "focus" | "break";
  title: string;
  body: string;
  reminderId?: string;
}

export interface CompanionReminderInput {
  id?: string;
  title: string;
  status: string;
  dueDate: string;
  dueTime?: string;
}

export function reminderMoment(reminder: CompanionReminderInput) {
  if (reminder.status !== "pending" || !reminder.title.trim()) return null;
  const due = new Date(reminder.dueDate);
  if (Number.isNaN(due.getTime())) return null;
  if (reminder.dueTime) {
    const [hours, minutes] = reminder.dueTime.split(":").map(Number);
    if (Number.isFinite(hours) && Number.isFinite(minutes)) due.setHours(hours, minutes, 0, 0);
  }
  return due.getTime();
}

function withReminder(line: CompanionLine, reminders: CompanionReminderInput[], now: number): CompanionLine {
  const pending = reminders.flatMap((reminder) => {
    const dueAt = reminderMoment(reminder);
    if (dueAt === null) return [];
    return [{ id: reminder.id, title: reminder.title.trim(), dueAt }];
  }).sort((a, b) => a.dueAt - b.dueAt);
  const due = pending.find((reminder) => reminder.dueAt <= now);
  if (due) return { ...line, title: "Reminder", body: due.title, reminderId: due.id };
  const upcoming = pending.find((reminder) => reminder.dueAt > now);
  if (!upcoming || line.mode !== "idle") return line;
  const minutes = Math.ceil((upcoming.dueAt - now) / 60000);
  if (minutes > 15) return line;
  const unit = minutes === 1 ? "minute" : "minutes";
  return { ...line, title: "Coming up", body: `${upcoming.title} in ${minutes} ${unit}.` };
}

export function companionMessage(
  snapshot: CompanionSnapshot,
  reminders: CompanionReminderInput[] = [],
  now = Date.now()
): CompanionLine {
  return withReminder(timerLine(snapshot), reminders, now);
}

function timerLine(snapshot: CompanionSnapshot): CompanionLine {
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
