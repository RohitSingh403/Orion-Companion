import AppRouter from "./router/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary";

import usePomodoro from "./hooks/usePomodoro";
import useTray from "./hooks/useTray";
import useReminders from "./hooks/useReminders";

export default function App() {
  usePomodoro();
  useTray();
  useReminders();

  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}