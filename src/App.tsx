import AppRouter from "./router/AppRouter";

import usePomodoro from "./hooks/usePomodoro";
import useTray from "./hooks/useTray";
import useReminders from "./hooks/useReminders";

export default function App() {
  usePomodoro();
  useTray();
  useReminders();

  return <AppRouter />;
}