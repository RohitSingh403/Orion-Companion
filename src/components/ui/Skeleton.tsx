import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export default function Skeleton({ 
  className = "", 
  variant = "text",
  width,
  height,
  animation = "pulse"
}: SkeletonProps) {
  const baseClasses = "bg-white/10 rounded";
  
  const variantClasses = {
    text: "h-4 w-full rounded-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationVariants = {
    pulse: {
      animate: {
        opacity: [0.6, 1, 0.6],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    wave: {
      animate: {
        x: ["-100%", "100%"],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
    none: {},
  };

  const animationProps = animationVariants[animation];

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      {...animationProps}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-elevated rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
