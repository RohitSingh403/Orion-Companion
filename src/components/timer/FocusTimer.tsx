// src/components/timer/FocusTimer.tsx

import { motion } from "framer-motion";
import ProgressRing from "./ProgressRing";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import { useFocusStore } from "../../store/focusStore";
import { useSettingsStore } from "../../store/settingsStore";

export default function FocusTimer() {
  const { running, start, pause, reset } = useFocusStore();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

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
            className="px-6 py-2.5 font-semibold text-sm rounded-full flex items-center gap-2 bg-white text-[#14161c] hover:bg-zinc-100 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <FiPlay className="w-4 h-4 fill-current" />
            <span>Start</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={pause}
            className={`px-6 py-2.5 font-semibold text-sm rounded-full flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-white/40 ${
              isDark 
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <FiPause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 ${
            isDark 
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </motion.button>
      </div>
    </div>
  );
}
