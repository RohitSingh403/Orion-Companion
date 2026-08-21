import { ReactNode, memo } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  "aria-label"?: string;
}

const Button = memo(function Button({
  children,
  className = "",
  "aria-label": ariaLabel,
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
      aria-label={ariaLabel}
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
        focus:outline-none
        focus:ring-2
        focus:ring-accent
        focus:ring-offset-2
        focus:ring-offset-[#0a0a0a]
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
});

export default Button;
