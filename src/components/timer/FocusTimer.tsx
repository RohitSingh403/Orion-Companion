import Card from "../ui/Card";
import Button from "../ui/Button";
import ProgressRing from "./ProgressRing";
import Companion from "../companion/Companion";

import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

import { useFocusStore } from "../../store/focusStore";

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
      {/* Title */}
      <h1 className="text-center text-4xl font-bold mb-2">
        🧠 Focus Companion
      </h1>

      {/* Current Session */}
      <p className="text-center text-zinc-400 text-lg capitalize mb-8">
        {session} Session
      </p>

      {/* Progress Ring */}
      <ProgressRing />

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        {!running ? (
          <Button
            onClick={start}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlay />
            Start
          </Button>
        ) : (
          <Button
            onClick={pause}
            className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
          >
            <FaPause />
            Pause
          </Button>
        )}

        <Button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
        >
          <FaRedo />
          Reset
        </Button>
      </div>

      {/* Progress */}
      <div className="mt-10 border-t border-zinc-800 pt-6">
        <h3 className="text-center text-zinc-400 text-lg">
          🔥 Today's Progress
        </h3>

        <p className="text-center text-3xl font-bold mt-2">
          {completedSessions}
        </p>

        <p className="text-center text-zinc-500">
          Completed Sessions
        </p>
      </div>

      {/* Companion */}
      <Companion
        session={session}
        running={running}
      />
    </Card>
  );
}