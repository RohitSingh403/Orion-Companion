interface OrionMarkProps {
  className?: string;
  title?: string;
}

export default function OrionMark({ className = "h-9 w-9", title = "Orion Companion" }: OrionMarkProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" role="img" aria-label={title}>
      <rect width="32" height="32" rx="8" fill="#10161f" />
      <circle cx="16" cy="16" r="9.2" fill="none" stroke="#24343c" strokeWidth="2.4" />
      <path
        d="M10.2 20.8a9.2 9.2 0 0 1 12.4-10.6"
        fill="none"
        stroke="#7CFFD4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="22.6" cy="10.4" r="1.7" fill="#8AF6FF" />
      <path d="M16 16.2V10.6" stroke="#f4f4f5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 16.2l3.8 2.4" stroke="#f4f4f5" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="16" cy="16.2" r="1.15" fill="#f4f4f5" />
    </svg>
  );
}
