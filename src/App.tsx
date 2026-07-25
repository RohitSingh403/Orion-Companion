import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";

import Header from "./components/dashboard/Header";
import GreetingCard from "./components/dashboard/GreetingCard";
import GoalCard from "./components/dashboard/GoalCard";
import StatsCard from "./components/dashboard/StatsCard";


import SettingsModal from "./components/settings/SettingsModal";

import FocusTimer from "./components/timer/FocusTimer";
import Companion from "./components/companion/Companion";
import BreakOverlay from "./components/overlay/BreakOverlay";

import usePomodoro from "./hooks/usePomodoro";
import { useFocusStore } from "./store/focusStore";

export default function App() {
  usePomodoro();

  const [settingsOpen, setSettingsOpen] = useState(false);

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
      <DashboardLayout
        left={
          <>
            <Header
              completedSessions={completedSessions}
              onSettings={() => setSettingsOpen(true)}
            />

            <GreetingCard />

            <GoalCard
              completedSessions={completedSessions}
              goal={dailyGoal}
            />

            <StatsCard
              completedSessions={completedSessions}
              focusMinutes={Math.floor(
                (completedSessions * focusDuration) / 60
              )}
            />

            
          </>
        }
        right={
          <div className="flex flex-col items-center gap-6 w-full">
            <FocusTimer />

            <Companion
              session={session}
              running={running}
            />
          </div>
        }
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <BreakOverlay
        visible={session === "break"}
        remainingTime={remainingTime}
      />
    </>
  );
}