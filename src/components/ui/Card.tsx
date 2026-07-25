import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div
      className="
      w-full
      max-w-2xl
      rounded-3xl
      border
      border-zinc-800
      bg-zinc-900/70
      backdrop-blur-xl
      shadow-2xl
      p-10
    "
    >
      {children}
    </div>
  );
}