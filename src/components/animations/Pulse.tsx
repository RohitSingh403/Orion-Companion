import { motion } from "framer-motion";

interface PulseProps {
  children: React.ReactNode;
  duration?: number;
  intensity?: number;
}

export default function Pulse({ 
  children, 
  duration = 2,
  intensity = 1 
}: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1 + (intensity * 0.05), 1],
        opacity: [1, 1 - (intensity * 0.1), 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
