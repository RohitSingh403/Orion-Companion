interface CompanionProps {
  session: "focus" | "break";
  running: boolean;
}

export default function Companion({
  session,
  running,
}: CompanionProps) {
  let emoji = "😴";
  let message = "Ready when you are.";

  if (running && session === "focus") {
    emoji = "🤓";
    message = "Stay focused. You're doing great!";
  }

  if (!running && session === "focus") {
    emoji = "🙂";
    message = "Press Start when you're ready.";
  }

  if (session === "break") {
    emoji = "☕";
    message = "Take a short break!";
  }

  return (
    <div className="mt-8 rounded-2xl bg-zinc-800 p-5 text-center">
      <div className="text-5xl">{emoji}</div>

      <p className="mt-3 text-zinc-300">{message}</p>
    </div>
  );
}