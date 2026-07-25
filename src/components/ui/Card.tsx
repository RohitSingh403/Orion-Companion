interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        bg-zinc-900/90
        backdrop-blur-lg
        border
        border-zinc-800
        rounded-3xl
        shadow-2xl
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}