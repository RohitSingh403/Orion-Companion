import { motion } from "framer-motion";
import { useFocusStore } from "../../store/focusStore";
import { formatTime } from "../../utils/time";

export default function ProgressRing() {
  const { remainingTime, session, focusDuration, breakDuration, running } =
    useFocusStore();

  const duration = session === "focus" ? focusDuration : breakDuration;

  const radius = 110;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;

  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = remainingTime / duration;

  const strokeDashoffset = circumference * (1 - progress);

  // Dynamic Color
  let color = "#22c55e";

  if (session === "break") {
    color = "#3b82f6";
  } else {
    if (progress < 0.5) color = "#f59e0b";
    if (progress < 0.2) color = "#ef4444";
  }

  const isEnding = running && remainingTime <= 10 && session === "focus";

  return (
    <div className="flex justify-center mb-8">
      <motion.div
        animate={
          isEnding
            ? {
                scale: [1, 1.03, 1],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 0.8,
        }}
        className="relative w-[260px] h-[260px]"
      >
        <svg width="260" height="260">
          {/* Background */}

          <circle
            cx="130"
            cy="130"
            r={normalizedRadius}
            stroke="#27272a"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress */}

          <motion.circle
            cx="130"
            cy="130"
            r={normalizedRadius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset,
              stroke: color,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            transform="rotate(-90 130 130)"
            style={{
              filter: `drop-shadow(0 0 12px ${color})`,
            }}
          />
        </svg>

        {/* Center */}

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            key={remainingTime}
            initial={{
              opacity: 0.4,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.18,
            }}
            className="text-6xl font-extrabold tracking-tight"
          >
            {formatTime(remainingTime)}
          </motion.h1>

          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className={`
              mt-4
              px-4
              py-1.5
              rounded-full
              text-sm
              font-semibold
              ${
                session === "focus"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-blue-500/20 text-blue-400"
              }
            `}
          >
            {session === "focus" ? "🎯 Focus Session" : "☕ Break Time"}
          </motion.div>
        </div>

        {/* Activity Dot */}

        {running && (
          <motion.div
            className="absolute top-2 left-1/2 w-4 h-4 rounded-full"
            style={{
              marginLeft: "-8px",
              backgroundColor: color,
              boxShadow: `0 0 15px ${color}`,
            }}
            animate={{
              scale: [1, 1.7, 1],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.3,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
