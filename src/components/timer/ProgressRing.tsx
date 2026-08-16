// src/components/timer/ProgressRing.tsx

import { motion } from "framer-motion";
import { useFocusStore } from "../../store/focusStore";
import { formatTime } from "../../utils/time";

export default function ProgressRing() {
  const { remainingTime, session, focusDuration, breakDuration, running } =
    useFocusStore();

  const duration = session === "focus" ? focusDuration : breakDuration;

  // Ring geometry
  const SIZE = 280;
  const CENTER = SIZE / 2;
  const RADIUS = 115;
  const STROKE = 10;
  const NORMALIZED_RADIUS = RADIUS - STROKE / 2;
  const CIRCUMFERENCE = 2 * Math.PI * NORMALIZED_RADIUS;

  const progress = Math.max(0, remainingTime / duration);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Dynamic ring color: green → amber → red for focus; blue for break
  let ringColor = "#22c55e";
  let labelBg = "bg-emerald-500/15";
  let labelText = "text-emerald-400";

  if (session === "break") {
    ringColor = "#3b82f6";
    labelBg = "bg-blue-500/15";
    labelText = "text-blue-400";
  } else {
    if (progress < 0.5) {
      ringColor = "#f59e0b";
      labelBg = "bg-amber-500/15";
      labelText = "text-amber-400";
    }
    if (progress < 0.2) {
      ringColor = "#ef4444";
      labelBg = "bg-red-500/15";
      labelText = "text-red-400";
    }
  }

  const isEnding = running && remainingTime <= 10 && session === "focus";

  const sessionLabel = session === "focus" ? "🎯 Focus Time" : "☕ Break Time";

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={isEnding ? { scale: [1, 1.025, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="relative"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          className="overflow-visible"
        >
          {/* Outer ambient glow ring (subtle) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={NORMALIZED_RADIUS + 8}
            stroke={ringColor}
            strokeWidth={1}
            fill="none"
            opacity={0.08}
          />

          {/* Track ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={NORMALIZED_RADIUS}
            stroke="#1c1c1f"
            strokeWidth={STROKE}
            fill="none"
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={NORMALIZED_RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{
              strokeDashoffset,
              stroke: ringColor,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{
              filter: `drop-shadow(0 0 14px ${ringColor}99)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* Timer digits */}
          <motion.span
            key={remainingTime}
            initial={{ opacity: 0.5, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="text-6xl font-extrabold tracking-tighter text-primary font-mono leading-none"
          >
            {formatTime(remainingTime)}
          </motion.span>

          {/* Session label pill */}
          <motion.div
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${labelBg} ${labelText} border border-current/20`}
          >
            {sessionLabel}
          </motion.div>
        </div>

        {/* Live activity dot at top of ring */}
        {running && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              top: CENTER - NORMALIZED_RADIUS - STROKE / 2,
              left: CENTER - 5,
              backgroundColor: ringColor,
              boxShadow: `0 0 12px ${ringColor}`,
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />
        )}
      </motion.div>
    </div>
  );
}
