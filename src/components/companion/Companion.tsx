// src/components/companion/Companion.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useFocusStore } from "../../store/focusStore";
import { useTaskStore } from "../../store/taskStore";

export default function Companion() {
  const session = useFocusStore((s) => s.session);
  const running = useFocusStore((s) => s.running);
  const completedSessions = useFocusStore((s) => s.completedSessions);
  const activeTaskId = useTaskStore((s) => s.activeTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  // Reserved for future active task display
  void tasks.find((t) => t.id === activeTaskId);

  // Determine companion state
  let emoji = "😴";
  let mood = "Idle";
  let message = "Ready when you are.";
  let moodColor = "text-zinc-400";
  let ringColor = "border-zinc-700";
  let bgGlow = "";

  if (!running && session === "focus") {
    emoji = "🙂";
    mood = "Resting";
    message = "Press Start when you're ready to focus.";
    moodColor = "text-blue-400";
    ringColor = "border-blue-500/40";
    bgGlow = "bg-blue-500/5";
  }

  if (running && session === "focus") {
    emoji = "🤓";
    mood = "Focused";
    message = "Stay in the zone. You're doing great!";
    moodColor = "text-emerald-400";
    ringColor = "border-emerald-500/40";
    bgGlow = "bg-emerald-500/5";
  }

  if (session === "break") {
    emoji = "☕";
    mood = "Resting";
    message = "Enjoy your break. Recharge and come back strong.";
    moodColor = "text-amber-400";
    ringColor = "border-amber-500/40";
    bgGlow = "bg-amber-500/5";
  }

  return (
    <div className={`glass-card p-5 rounded-2xl border ${ringColor} ${bgGlow} transition-all duration-500 flex flex-col items-center text-center space-y-4`}>
      {/* Header */}
      <div className="w-full flex items-center justify-between text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
        <span>Companion</span>
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${moodColor} border-current bg-current/10`}>
          {mood}
        </span>
      </div>

      {/* Animated Avatar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={emoji}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Pulsing glow ring when running */}
          {running && session === "focus" && (
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
            />
          )}

          <div className="relative w-20 h-20 rounded-full bg-zinc-900/80 border border-zinc-700/80 flex items-center justify-center text-4xl shadow-lg">
            {emoji}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
          className="text-xs text-zinc-400 leading-relaxed px-2"
        >
          {message}
        </motion.p>
      </AnimatePresence>

      {/* Session count mini stat */}
      <div className="w-full pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-2">
        <span className="text-[10px] text-zinc-500">Today's Sessions</span>
        <span className="text-xs font-bold text-emerald-400">
          {completedSessions}
        </span>
      </div>
    </div>
  );
}
