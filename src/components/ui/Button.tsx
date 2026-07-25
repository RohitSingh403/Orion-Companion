import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        px-7
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-200
        hover:scale-105
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
}