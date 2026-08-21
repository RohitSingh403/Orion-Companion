import { motion } from "framer-motion";

interface ShakeProps {
  children: React.ReactNode;
  trigger?: boolean;
  intensity?: number;
}

export default function Shake({ 
  children, 
  trigger = false,
  intensity = 1 
}: ShakeProps) {
  return (
    <motion.div
      animate={trigger ? {
        x: [0, -5 * intensity, 5 * intensity, -5 * intensity, 5 * intensity, 0],
      } : {}}
      transition={{
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}
