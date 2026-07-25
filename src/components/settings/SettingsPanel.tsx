import Card from "../ui/Card";
import { useFocusStore } from "../../store/focusStore";

export default function SettingsPanel() {
  const {
    focusDuration,
    breakDuration,
    dailyGoal,
    setFocusDuration,
    setBreakDuration,
    setDailyGoal,
  } = useFocusStore();

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">
        ⚙️ Settings
      </h2>

      <div className="space-y-5">

        {/* Focus Duration */}

        <div>
          <label className="block text-zinc-400 mb-2">
            Focus Duration (minutes)
          </label>

          <input
            type="number"
            min={1}
            value={focusDuration / 60}
            onChange={(e) =>
              setFocusDuration(Number(e.target.value))
            }
            className="w-full rounded-lg bg-zinc-800 p-3"
          />
        </div>

        {/* Break Duration */}

        <div>
          <label className="block text-zinc-400 mb-2">
            Break Duration (minutes)
          </label>

          <input
            type="number"
            min={1}
            value={breakDuration / 60}
            onChange={(e) =>
              setBreakDuration(Number(e.target.value))
            }
            className="w-full rounded-lg bg-zinc-800 p-3"
          />
        </div>

        {/* Daily Goal */}

        <div>
          <label className="block text-zinc-400 mb-2">
            Daily Goal (sessions)
          </label>

          <input
            type="number"
            min={1}
            value={dailyGoal}
            onChange={(e) =>
              setDailyGoal(Number(e.target.value))
            }
            className="w-full rounded-lg bg-zinc-800 p-3"
          />
        </div>

      </div>
    </Card>
  );
}