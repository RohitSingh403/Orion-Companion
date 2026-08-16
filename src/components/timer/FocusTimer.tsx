// src/components/timer/FocusTimer.tsx

import { motion } from "framer-motion";
import ProgressRing from "./ProgressRing";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import { useFocusStore } from "../../store/focusStore";

export default function FocusTimer() {
  const { running, start, pause, reset } = useFocusStore();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 select-none w-full">
      {/* Animated SVG Progress Ring */}
      <ProgressRing />

      {/* Timer Controls matching new design system */}
      <div className="flex items-center gap-3">
        {!running ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={start}
            className="px-6 py-2.5 btn-primary font-bold text-sm rounded-lg flex items-center gap-2"
          >
            <FiPlay className="w-4 h-4 fill-current" />
            <span>Start</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={pause}
            className="px-6 py-2.5 btn-secondary font-bold text-sm rounded-lg flex items-center gap-2"
          >
            <FiPause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="px-4 py-2.5 btn-ghost text-sm font-semibold flex items-center gap-2"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </motion.button>
      </div>
    </div>
  );
}
