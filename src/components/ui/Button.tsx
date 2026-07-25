import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      {...props}
      className={`
        px-8
        py-3
        rounded-xl
        font-semibold
        text-white
        shadow-lg
        transition-colors
        duration-200
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
