import FocusTimer from "./components/timer/FocusTimer";
import BreakOverlay from "./components/overlay/BreakOverlay";

import usePomodoro from "./hooks/usePomodoro";
import { useFocusStore } from "./store/focusStore";

export default function App() {
  usePomodoro();

  const { session, remainingTime } = useFocusStore();

  return (
    <>
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
        <FocusTimer />
      </main>

      <BreakOverlay
        visible={session === "break"}
        remainingTime={remainingTime}
      />
    </>
  );
}