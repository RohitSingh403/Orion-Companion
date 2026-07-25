import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="
        w-full
        max-w-4xl
        rounded-[32px]
        border
        border-zinc-800
        bg-zinc-900/80
        backdrop-blur-xl
        shadow-2xl
        p-10
      "
    >
      {children}
    </motion.div>
  );
}