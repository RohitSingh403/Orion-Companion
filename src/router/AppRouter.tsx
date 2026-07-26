// src/router/AppRouter.tsx

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardContent from "../components/dashboard/DashboardContent";

import TasksPage from "../pages/Tasks/TasksPage";

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold">
        {title}
        <span className="ml-2 text-lg text-zinc-500">
          {" "}
          (Coming Soon)
        </span>
      </h1>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<DashboardContent />}
        />

        <Route
          path="/focus"
          element={<PlaceholderPage title="Focus" />}
        />

        <Route
          path="/tasks"
          element={<TasksPage />}
        />

        <Route
          path="/notes"
          element={<PlaceholderPage title="Notes" />}
        />

        <Route
          path="/analytics"
          element={<PlaceholderPage title="Analytics" />}
        />

        <Route
          path="/achievements"
          element={<PlaceholderPage title="Achievements" />}
        />

        <Route
          path="/settings"
          element={<PlaceholderPage title="Settings" />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}