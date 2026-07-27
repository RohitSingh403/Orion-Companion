import AppRouter from "./router/AppRouter";

import usePomodoro from "./hooks/usePomodoro";

export default function App() {
  usePomodoro();

  return <AppRouter />;
}