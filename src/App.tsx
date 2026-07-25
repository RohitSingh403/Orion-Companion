import { useState } from "react";

import DashboardLayout from "./layouts/DashboardLayout";

import Header from "./components/dashboard/Header";
import GreetingCard from "./components/dashboard/GreetingCard";
import GoalCard from "./components/dashboard/GoalCard";
import StatsCard from "./components/dashboard/StatsCard";
import AdvancedStats from "./components/dashboard/AdvancedStats";
import AchievementCard from "./components/dashboard/AchievementCard";
import DashboardTabs from "./components/dashboard/DashboardTabs";

import SettingsModal from "./components/settings/SettingsModal";

import FocusTimer from "./components/timer/FocusTimer";
import Companion from "./components/companion/Companion";
import SessionHistory from "./components/history/SessionHistory";
import BreakOverlay from "./components/overlay/BreakOverlay";

import AchievementToast from "./components/ui/AchievementToast";

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

            <GoalCard completedSessions={completedSessions} goal={dailyGoal} />

            <DashboardTabs
              dashboard={
                <>
                  <StatsCard
                    completedSessions={completedSessions}
                    focusMinutes={Math.floor(
                      (completedSessions * focusDuration) / 60,
                    )}
                  />

                  <div className="mt-4">
                    <AdvancedStats />
                  </div>
                </>
              }
              achievements={<AchievementCard />}
            />
          </>
        }
        right={
          <div className="w-full flex flex-col gap-6">
            <FocusTimer />

            <div className="grid grid-cols-2 gap-6">
              <Companion session={session} running={running} />

              <SessionHistory />
            </div>
          </div>
        }
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Achievement Toast */}
      <AchievementToast />

      <BreakOverlay
        visible={session === "break"}
        remainingTime={remainingTime}
      />
    </>
  );
}
