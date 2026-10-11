import type { ReactNode } from "react";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import CommandBar from "../components/shell/CommandBar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    document.body.style.background = "#2c2f36";
    document.body.style.color = "#f4f4f5";
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="h-screen w-screen bg-[#2c2f36] p-2 font-sans text-zinc-100 md:p-3">
      <div className="flex h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#14161c] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar />
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
