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
        rounded-3xl
        border border-zinc-800
        bg-zinc-900/90
        backdrop-blur-xl
        shadow-xl
        p-6
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}