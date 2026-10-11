interface OrionMarkProps {
  className?: string;
  title?: string;
}

export default function OrionMark({ className = "h-9 w-9", title = "Orion Companion" }: OrionMarkProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" role="img" aria-label={title}>
      <rect width="32" height="32" rx="9" fill="#172033" />
      <path
        d="M7.5 18.5c3.2-7.2 9.4-10.2 17-8.2"
        fill="none"
        stroke="#5DFFC2"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="9" cy="21.5" r="2.15" fill="#5DFFC2" />
      <circle cx="16" cy="15.2" r="2.45" fill="#8AF6FF" />
      <circle cx="23" cy="9.2" r="2.05" fill="#5DFFC2" />
    </svg>
  );
}
