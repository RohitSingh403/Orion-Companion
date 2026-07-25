import { motion, AnimatePresence } from "framer-motion";

interface CompanionProps {
  session: "focus" | "break";
  running: boolean;
}

export default function Companion({ session, running }: CompanionProps) {
  let emoji = "😴";
  let message = "Ready when you are.";

  if (!running && session === "focus") {
    emoji = "🙂";
    message = "Press Start when you're ready.";
  }

  if (running && session === "focus") {
    emoji = "🤓";
    message = "Stay focused. You're doing great!";
  }

  if (session === "break") {
    emoji = "☕";
    message = "Take a short break!";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
      }}
      className=" rounded-2xl border border-zinc-800 bg-zinc-800/60 p-5"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={emoji}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <div className="text-5xl">{emoji}</div>

          <p className="mt-3 text-zinc-300">{message}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
