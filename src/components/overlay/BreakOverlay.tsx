// src/components/overlay/BreakOverlay.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useFocusStore } from "../../store/focusStore";
import { FiDroplet, FiActivity, FiWind, FiCheck } from "react-icons/fi";

interface BreakOverlayProps {
  visible: boolean;
  remainingTime: number;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function BreakOverlay({
  visible,
  remainingTime,
}: BreakOverlayProps) {
  const { reset } = useFocusStore();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/95 backdrop-blur-2xl select-none"
        >
          {/* Ambient wallpaper glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-emerald-950/20 to-[#09090b] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 flex flex-col items-center max-w-md w-full p-8 text-center card-elevated rounded-3xl border border-white/10 shadow-2xl space-y-6"
          >
            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                Take a Break!
              </h1>
              <p className="text-xs text-secondary">Relax your mind and body</p>
            </div>

            {/* Glowing Circular Timer Ring */}
            <div className="relative w-48 h-48 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#18181b"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={
                    2 * Math.PI * 80 * (1 - remainingTime / (5 * 60))
                  }
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-primary tracking-tight font-mono">
                  {formatTime(remainingTime)}
                </span>
                <span className="text-[10px] font-semibold text-blue-400 mt-1 uppercase tracking-widest">
                  Rest Period
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                onClick={reset}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-secondary text-xs font-semibold rounded-xl transition"
              >
                Skip Break
              </button>
              <button
                onClick={reset}
                className="flex-1 py-2.5 btn-primary text-zinc-950 text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <FiCheck className="w-4 h-4 stroke-[3]" />
                <span>End Break</span>
              </button>
            </div>

            {/* Quick Activity Badges */}
            <div className="pt-4 border-t border-white/10 w-full grid grid-cols-4 gap-2 text-secondary">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 text-[10px]">
                <FiDroplet className="w-4 h-4 text-blue-400" />
                <span>Drink Water</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 text-[10px]">
                <FiActivity className="w-4 h-4 text-amber-400" />
                <span>Stretch</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 text-[10px]">
                <span className="text-sm">🚶</span>
                <span>Walk</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 text-[10px]">
                <FiWind className="w-4 h-4 text-teal-400" />
                <span>Breathe</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
