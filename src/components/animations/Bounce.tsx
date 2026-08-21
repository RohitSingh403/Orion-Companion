import { motion } from "framer-motion";

interface BounceProps {
  children: React.ReactNode;
  intensity?: number;
}

export default function Bounce({ 
  children, 
  intensity = 1 
}: BounceProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1 + (intensity * 0.05),
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 1 - (intensity * 0.05),
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
}
