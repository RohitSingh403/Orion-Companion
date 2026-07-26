// src/layouts/AppLayout.tsx

import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {children}
    </div>
  );
}