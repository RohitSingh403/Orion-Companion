import { ReactNode } from "react";

interface DashboardLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function DashboardLayout({ left, right }: DashboardLayoutProps) {
  return (
    <main className="h-screen bg-zinc-950 overflow-hidden p-8">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <aside
          className="
            col-span-4
            h-full
            overflow-y-auto
            no-scrollbar
            space-y-4
            pr-2
          "
        >
          {left}
        </aside>

        {/* Main Content */}
        <section
          className="
    col-span-8
    h-full
    overflow-y-auto
    no-scrollbar
    px-2
    py-6
  "
        >
          <div className="min-h-full flex flex-col items-center justify-start">
            {right}
          </div>
        </section>
      </div>
    </main>
  );
}
