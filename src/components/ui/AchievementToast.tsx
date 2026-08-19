// src/components/ui/AchievementToast.tsx

import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiX, FiStar } from "react-icons/fi";
import { useToastStore } from "../../store/toastStore";
import type { AchievementRarity } from "../../types/achievement";

export default function AchievementToast() {
  const { visible, title, message, hideToast, rarity = "common", icon } = useToastStore();

  const getRarityGradient = (rarity: AchievementRarity) => {
    switch (rarity) {
      case "common":
        return "from-zinc-500/20 to-zinc-600/20";
      case "rare":
        return "from-blue-500/20 to-blue-600/20";
      case "epic":
        return "from-purple-500/20 to-purple-600/20";
      case "legendary":
        return "from-amber-500/20 to-amber-600/20";
      default:
        return "from-accent/20 to-accent/30";
    }
  };

  const getRarityBorder = (rarity: AchievementRarity) => {
    switch (rarity) {
      case "common":
        return "border-zinc-500/40";
      case "rare":
        return "border-blue-500/40";
      case "epic":
        return "border-purple-500/40";
      case "legendary":
        return "border-amber-500/40";
      default:
        return "border-accent/40";
    }
  };

  const showParticles = rarity === "epic" || rarity === "legendary";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-80 card-elevated p-4 rounded-2xl border border-white/10 shadow-2xl flex items-start gap-3 select-none overflow-hidden relative"
        >
          {/* Background gradient based on rarity */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(rarity)} pointer-events-none`} />
          
          {/* Rarity border glow */}
          <div className={`absolute inset-0 border-2 ${getRarityBorder(rarity)} rounded-2xl pointer-events-none opacity-50`} />

          {/* Particle effects for epic/legendary */}
          {showParticles && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                  className="absolute w-1 h-1 rounded-full bg-amber-400"
                  style={{
                    top: `${20 + (i % 4) * 20}%`,
                    left: `${20 + Math.floor(i / 4) * 20}%`,
                  }}
                />
              ))}
            </>
          )}

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
            className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl flex-shrink-0 mt-0.5 relative z-10"
          >
            {icon || <FiAward className="w-6 h-6 text-accent" />}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-primary">Achievement Unlocked!</h4>
                {rarity !== "common" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <FiStar className="w-4 h-4 text-amber-400" />
                  </motion.div>
                )}
              </div>
              <h5 className="text-xs font-semibold text-accent mt-1">{title}</h5>
              <p className="text-[11px] text-secondary mt-0.5 leading-snug">
                {message}
              </p>
            </motion.div>
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={hideToast}
            className="text-muted hover:text-primary transition p-1 relative z-10"
          >
            <FiX className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
