import GreetingCard from "./components/dashboard/GreetingCard";
import GoalCard from "./components/dashboard/GoalCard";
import StatsCard from "./components/dashboard/StatsCard";

import FocusTimer from "./components/timer/FocusTimer";
import BreakOverlay from "./components/overlay/BreakOverlay";

import usePomodoro from "./hooks/usePomodoro";
import { useFocusStore } from "./store/focusStore";

export default function App() {
  usePomodoro();

  const {
    session,
    remainingTime,
    completedSessions,
    focusDuration,
  } = useFocusStore();

  return (
    <>
      <main className="min-h-screen bg-zinc-950 p-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Dashboard */}

          <div className="space-y-6">

            <GreetingCard />

            <GoalCard
              completedSessions={completedSessions}
              goal={8}
            />

            <StatsCard
              completedSessions={completedSessions}
              focusMinutes={
                Math.floor(
                  (completedSessions * focusDuration) / 60
                )
              }
            />

          </div>

          {/* Right Side */}

          <div className="lg:col-span-2 flex items-center justify-center">

            <FocusTimer />

          </div>

        </div>
      </main>

      <BreakOverlay
        visible={session === "break"}
        remainingTime={remainingTime}
      />
    </>
  );
}