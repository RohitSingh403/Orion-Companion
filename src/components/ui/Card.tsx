import { memo } from "react";
import FadeIn from "../animations/FadeIn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = memo(function Card({ children, className = "" }: CardProps) {
  return (
    <FadeIn>
      <div
        className={`
          rounded-3xl
          border border-zinc-800
          bg-zinc-900/90
          backdrop-blur-xl
          shadow-xl
          p-6
          transition-all
          duration-300
          hover:border-zinc-700
          hover:shadow-2xl
          ${className}
        `}
      >
        {children}
      </div>
    </FadeIn>
  );
});

export default Card;
