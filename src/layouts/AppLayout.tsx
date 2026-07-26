// src/layouts/AppLayout.tsx

import type { ReactNode } from "react";
import Sidebar from "../components/sidebar/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}