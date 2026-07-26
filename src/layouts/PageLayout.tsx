// src/layouts/PageLayout.tsx

import type { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  children,
}: PageLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 px-10 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-zinc-400">
            {subtitle}
          </p>
        )}
      </header>

      {/* Scrollable Content */}
      <section className="min-h-0 flex-1 overflow-y-auto px-10 py-8">
        {children}
      </section>
    </div>
  );
}