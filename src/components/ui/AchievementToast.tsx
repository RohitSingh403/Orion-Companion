// src/components/ui/AchievementToast.tsx

import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiX } from "react-icons/fi";
import { useToastStore } from "../../store/toastStore";

export default function AchievementToast() {
  const { visible, title, message, hideToast } = useToastStore();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-50 w-80 glass-card p-4 rounded-2xl border border-emerald-500/40 shadow-2xl glow-emerald flex items-start gap-3 select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
            <FiAward className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-zinc-100">{title}</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
              {message}
            </p>
          </div>

          <button
            onClick={hideToast}
            className="text-zinc-500 hover:text-zinc-300 transition p-1"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
