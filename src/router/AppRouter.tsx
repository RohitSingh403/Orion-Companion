// src/router/AppRouter.tsx

import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import SitePage from "../pages/Site/SitePage";

// Lazy load all pages for code splitting
const DashboardContent = lazy(() => import("../components/dashboard/DashboardContent").then(m => ({ default: m.default })));
const FocusPage = lazy(() => import("../pages/Focus/FocusPage").then(m => ({ default: m.default })));
const TasksPage = lazy(() => import("../pages/Tasks/TasksPage").then(m => ({ default: m.default })));
const CalendarPage = lazy(() => import("../pages/Calendar/CalendarPage").then(m => ({ default: m.default })));
const NotesPage = lazy(() => import("../pages/Notes/NotesPage").then(m => ({ default: m.default })));
const AnalyticsPage = lazy(() => import("../pages/Analytics/AnalyticsPage").then(m => ({ default: m.default })));
const AchievementsPage = lazy(() => import("../pages/Achievements/AchievementsPage").then(m => ({ default: m.default })));
const SettingsPage = lazy(() => import("../pages/Settings/SettingsPage").then(m => ({ default: m.default })));
const MiniTimerPage = lazy(() => import("../pages/MiniTimer/MiniTimerPage").then(m => ({ default: m.default })));
const RemindersPage = lazy(() => import("../pages/Reminders/RemindersPage").then(m => ({ default: m.default })));
const AICompanionPage = lazy(() => import("../pages/AICompanion/AICompanionPage").then(m => ({ default: m.default })));
const CompanionPage = lazy(() => import("../pages/Companion/CompanionPage").then(m => ({ default: m.default })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0a0a0a]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-secondary">Loading...</p>
      </div>
    </div>
  );
}

function RootRoute() {
  const navigate = useNavigate();
  const desktop = typeof window !== "undefined" && Boolean(window.focusAPI);
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const mini = params.get("surface") === "mini";
  const companion = params.get("surface") === "companion";

  useEffect(() => {
    if (mini) {
      navigate("/mini-timer?surface=mini", { replace: true });
      return;
    }
    if (companion) {
      navigate("/companion?surface=companion", { replace: true });
      return;
    }
    if (desktop) navigate("/app", { replace: true });
  }, [desktop, mini, companion, navigate]);

  if (mini || companion || desktop) return null;
  return <SitePage />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/app" element={<DashboardContent />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/ai-companion" element={<AICompanionPage />} />
          <Route path="/mini-timer" element={<MiniTimerPage />} />
          <Route path="/companion" element={<CompanionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}