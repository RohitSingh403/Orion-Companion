// src/layouts/AppLayout.tsx

import type { ReactNode } from "react";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import { useSettingsStore } from "../store/settingsStore";
import SlideIn from "../components/animations/SlideIn";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    // Apply theme to document
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.body.style.background = "#fafafa";
      document.body.style.color = "#0a0a0a";
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.body.style.background = "#0a0a0a";
      document.body.style.color = "#fafafa";
    }
  }, [theme]);

  return (
    <div className={`flex h-screen w-screen text-primary overflow-hidden font-sans select-none ${theme === "light" ? "bg-gray-50" : "bg-[#0a0a0a]"}`}>
      {/* Permanent Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AnimatePresence mode="wait">
          <SlideIn direction="right" duration={0.3}>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {children}
            </div>
          </SlideIn>
        </AnimatePresence>
      </main>
    </div>
  );
}