import { motion } from "framer-motion";

interface FlipProps {
  children: React.ReactNode;
  isFlipped?: boolean;
  duration?: number;
}

export default function Flip({ 
  children, 
  isFlipped = false,
  duration = 0.6 
}: FlipProps) {
  return (
    <motion.div
      animate={{ 
        rotateY: isFlipped ? 180 : 0,
      }}
      transition={{ duration }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
