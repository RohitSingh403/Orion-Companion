import { motion, AnimatePresence } from "framer-motion";

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
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <div className="text-8xl mb-6">☕</div>

            <h1 className="text-5xl font-bold">Break Time</h1>

            <p className="mt-3 text-zinc-400 text-xl">
              Relax for a few minutes.
            </p>

            <div className="mt-8 text-6xl font-bold">
              {formatTime(remainingTime)}
            </div>

            <div className="mt-8 space-y-2 text-zinc-500">
              <p>💧 Drink some water</p>
              <p>🧍 Stretch your body</p>
              <p>👀 Rest your eyes</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
