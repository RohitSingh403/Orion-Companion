import { useState } from "react";

import AppLayout from "../../layouts/AppLayout";
import DashboardLayout from "../../layouts/DashboardLayout";

import Header from "./Header";
import GreetingCard from "./GreetingCard";
import GoalCard from "./GoalCard";
import StatsCard from "./StatsCard";
import AdvancedStats from "./AdvancedStats";
import AchievementCard from "./AchievementCard";
import DashboardTabs from "./DashboardTabs";

import SettingsModal from "../settings/SettingsModal";

import FocusTimer from "../timer/FocusTimer";
import Companion from "../companion/Companion";
import SessionHistory from "../history/SessionHistory";
import BreakOverlay from "../overlay/BreakOverlay";

import AchievementToast from "../ui/AchievementToast";

import usePomodoro from "../../hooks/usePomodoro";
import { useFocusStore } from "../../store/focusStore";

export default function DashboardContent() {
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
    <AppLayout>
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

              <DashboardTabs
                dashboard={
                  <>
                    <StatsCard
                      completedSessions={completedSessions}
                      focusMinutes={Math.floor(
                        (completedSessions * focusDuration) / 60
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
                <Companion
                  session={session}
                  running={running}
                />

                <SessionHistory />
              </div>
            </div>
          }
        />

        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />

        <AchievementToast />

        <BreakOverlay
          visible={session === "break"}
          remainingTime={remainingTime}
        />
      </>
    </AppLayout>
  );
}