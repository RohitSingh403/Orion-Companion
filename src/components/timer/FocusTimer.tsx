import Card from "../ui/Card";
import Button from "../ui/Button";

import { useFocusStore } from "../../store/focusStore";
import ProgressRing from "./ProgressRing";

export default function FocusTimer() {
  const {
    session,
  running,
  completedSessions,
  start,
  pause,
  reset,
} = useFocusStore();

  return (
    <Card>
      <h2 className="text-center text-zinc-400 text-xl mb-3 capitalize">
        {session} Session
      </h2>

      {/* <h1 className="text-center text-8xl font-bold tracking-tight mb-10">
        {formatTime(remainingTime)}
      </h1> */}
      <ProgressRing></ProgressRing>

      <div className="flex justify-center gap-4">
        {!running ? (
          <Button
            onClick={start}
            className="bg-green-600 hover:bg-green-700"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={pause}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Pause
          </Button>
        )}

        <Button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700"
        >
          Reset
        </Button>
      </div>

      <p className="text-center text-zinc-400 mt-10">
        🔥 Completed Sessions: {completedSessions}
      </p>
    </Card>
  );
}