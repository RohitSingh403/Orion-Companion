// src/router/AppRouter.tsx

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardContent from "../components/dashboard/DashboardContent";
import FocusPage from "../pages/Focus/FocusPage";
import TasksPage from "../pages/Tasks/TasksPage";
import CalendarPage from "../pages/Calendar/CalendarPage";
import NotesPage from "../pages/Notes/NotesPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import AchievementsPage from "../pages/Achievements/AchievementsPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import MiniTimerPage from "../pages/MiniTimer/MiniTimerPage";
import RemindersPage from "../pages/Reminders/RemindersPage";
import AICompanionPage from "../pages/AICompanion/AICompanionPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardContent />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}