import GreetingCard from "./components/dashboard/GreetingCard";
import GoalCard from "./components/dashboard/GoalCard";
import StatsCard from "./components/dashboard/StatsCard";
import SettingsPanel from "./components/settings/SettingsPanel";
import Companion from "./components/companion/Companion";

import FocusTimer from "./components/timer/FocusTimer";
import BreakOverlay from "./components/overlay/BreakOverlay";

import usePomodoro from "./hooks/usePomodoro";
import { useFocusStore } from "./store/focusStore";

export default function App() {
  usePomodoro();

  const {
    session,
    running,
    remainingTime,
    completedSessions,
    focusDuration,
    dailyGoal,
  } = useFocusStore();

  return (
    <>
      <main className="h-screen bg-zinc-950 overflow-hidden p-8">
        <div className="mx-auto max-w-7xl h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDEBAR */}
          <aside
            className="
    space-y-4
    overflow-y-auto
    no-scrollbar
    pr-2
    h-full
  "
          >
            <GreetingCard />

            <GoalCard completedSessions={completedSessions} goal={dailyGoal} />

            <StatsCard
              completedSessions={completedSessions}
              focusMinutes={Math.floor(
                (completedSessions * focusDuration) / 60,
              )}
            />

            <SettingsPanel />
          </aside>

          {/* RIGHT CONTENT */}
         <section
  className="
    lg:col-span-2
    h-full
    overflow-y-auto
    no-scrollbar
    flex
    flex-col
    items-center
    gap-6
    py-4
  "
>
            <FocusTimer />

            <Companion session={session} running={running} />
          </section>
        </div>
      </main>

      <BreakOverlay
        visible={session === "break"}
        remainingTime={remainingTime}
      />
    </>
  );
}
