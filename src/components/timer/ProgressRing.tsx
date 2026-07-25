import { motion } from "framer-motion";
import { useFocusStore } from "../../store/focusStore";
import { formatTime } from "../../utils/time";

export default function ProgressRing() {
  const {
    remainingTime,
    session,
    focusDuration,
    breakDuration,
    running,
  } = useFocusStore();

  const duration =
    session === "focus"
      ? focusDuration
      : breakDuration;

  const radius = 110;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;

  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = remainingTime / duration;

  const strokeDashoffset =
    circumference * (1 - progress);

  let color = "#22c55e";

  if (progress < 0.5) color = "#f59e0b";

  if (progress < 0.2) color = "#ef4444";

  return (
    <div className="flex justify-center mb-10">

      <div className="relative w-[250px] h-[250px]">

        <svg
          width="250"
          height="250"
        >

          {/* Background Ring */}

          <circle
            cx="125"
            cy="125"
            r={normalizedRadius}
            stroke="#27272a"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Animated Ring */}

          <motion.circle
            cx="125"
            cy="125"
            r={normalizedRadius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset,
            }}
            transition={{
              duration: 0.8,
              ease: "linear",
            }}
            transform="rotate(-90 125 125)"
            style={{
              filter: `drop-shadow(0px 0px 8px ${color})`,
            }}
          />

        </svg>

        {/* Timer */}

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
              duration: 0.2,
            }}
            className="text-6xl font-bold"
          >
            {formatTime(remainingTime)}
          </motion.h1>

          <p className="text-zinc-400 mt-2 capitalize">
            {session} Session
          </p>

        </div>

        {/* Pulsing Dot */}

        {running && (
          <motion.div
            className="absolute top-2 left-1/2 w-4 h-4 rounded-full bg-green-400"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            style={{
              marginLeft: "-8px",
            }}
          />
        )}

      </div>

    </div>
  );
}