import { useState } from "react";
import Card from "../ui/Card";
import { useFocusStore } from "../../store/focusStore";
import { useAchievementStore } from "../../store/achievementStore";

export default function SettingsPanel() {
  const {
    focusDuration,
    breakDuration,
    dailyGoal,

    setFocusDuration,
    setBreakDuration,
    setDailyGoal,

    resetHistory,
    resetTodayProgress,
    resetStreak,
    resetSettings,
  } = useFocusStore();

  const resetAchievements =
    useAchievementStore(
      (state) => state.resetAchievements
    );

  // -------------------------
  // Reset Checkboxes
  // -------------------------

  const [historyChecked, setHistoryChecked] =
    useState(true);

  const [progressChecked, setProgressChecked] =
    useState(true);

  const [streakChecked, setStreakChecked] =
    useState(false);

  const [achievementChecked, setAchievementChecked] =
    useState(false);

  const [settingsChecked, setSettingsChecked] =
    useState(false);

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset the selected data?"
    );

    if (!confirmed) return;

    if (historyChecked) resetHistory();

    if (progressChecked) resetTodayProgress();

    if (streakChecked) resetStreak();

    if (achievementChecked) resetAchievements();

    if (settingsChecked) resetSettings();
  };

  const changeFocus = (amount: number) => {
    const value = Math.max(
      5,
      focusDuration / 60 + amount
    );

    setFocusDuration(value);
  };

  const changeBreak = (amount: number) => {
    const value = Math.max(
      1,
      breakDuration / 60 + amount
    );

    setBreakDuration(value);
  };

  const changeGoal = (amount: number) => {
    const value = Math.max(
      1,
      dailyGoal + amount
    );

    setDailyGoal(value);
  };

  return (
    <div className="space-y-6">

      {/* Focus Settings */}

      <Card>

        <h3 className="text-xl font-bold mb-5">
          ⏱ Focus Settings
        </h3>

        <SettingRow
          title="Focus Duration"
          value={`${focusDuration / 60} min`}
          onDecrease={() => changeFocus(-5)}
          onIncrease={() => changeFocus(5)}
        />

        <SettingRow
          title="Break Duration"
          value={`${breakDuration / 60} min`}
          onDecrease={() => changeBreak(-1)}
          onIncrease={() => changeBreak(1)}
        />

        <SettingRow
          title="Daily Goal"
          value={`${dailyGoal} Sessions`}
          onDecrease={() => changeGoal(-1)}
          onIncrease={() => changeGoal(1)}
        />

      </Card>

      {/* Data Management */}

      <Card>

        <h3 className="text-xl font-bold mb-5">
          🧹 Data Management
        </h3>

        <Checkbox
          label="Session History"
          checked={historyChecked}
          onChange={setHistoryChecked}
        />

        <Checkbox
          label="Today's Progress"
          checked={progressChecked}
          onChange={setProgressChecked}
        />

        <Checkbox
          label="Current Streak"
          checked={streakChecked}
          onChange={setStreakChecked}
        />

        <Checkbox
          label="Achievements"
          checked={achievementChecked}
          onChange={setAchievementChecked}
        />

        <Checkbox
          label="Timer Settings"
          checked={settingsChecked}
          onChange={setSettingsChecked}
        />

        <button
          onClick={handleReset}
          className="
            mt-6
            w-full
            rounded-xl
            bg-red-600
            py-3
            font-semibold
            transition
            hover:bg-red-700
          "
        >
          Reset Selected
        </button>

      </Card>

    </div>
  );
}

interface SettingRowProps {
  title: string;
  value: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

function SettingRow({
  title,
  value,
  onIncrease,
  onDecrease,
}: SettingRowProps) {
  return (
    <div className="mb-5 flex items-center justify-between">

      <div>
        <p className="font-medium">{title}</p>

        <p className="text-sm text-zinc-400">
          {value}
        </p>
      </div>

      <div className="flex gap-2">

        <button
          onClick={onDecrease}
          className="rounded-lg bg-zinc-800 px-3 py-2 hover:bg-zinc-700"
        >
          −
        </button>

        <button
          onClick={onIncrease}
          className="rounded-lg bg-zinc-800 px-3 py-2 hover:bg-zinc-700"
        >
          +
        </button>

      </div>

    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Checkbox({
  label,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <label className="mb-3 flex items-center gap-3">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      <span>{label}</span>

    </label>
  );
}