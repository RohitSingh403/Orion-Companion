import Card from "../ui/Card";
import Button from "../ui/Button";
import ProgressRing from "./ProgressRing";

import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

import { useFocusStore } from "../../store/focusStore";
import { playSound } from "../../utils/audio";

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
    <Card className="w-full max-w-4xl">
      {/* Title */}
      <h1 className="text-center text-3xl font-bold">
        🧠 Focus Companion
      </h1>

      {/* Session */}
      <p className="mt-1 text-center text-zinc-400 capitalize">
        {session} Session
      </p>

      {/* Timer */}
      <div className="my-5 flex justify-center">
        <ProgressRing />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!running ? (
          <Button
            onClick={() => {
              playSound("start.mp3");
              start();
            }}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlay />
            Start
          </Button>
        ) : (
          <Button
            onClick={() => {
              playSound("click.mp3");
              pause();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
          >
            <FaPause />
            Pause
          </Button>
        )}

        <Button
          onClick={() => {
            playSound("click.mp3");
            reset();
          }}
          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
        >
          <FaRedo />
          Reset
        </Button>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-zinc-800" />

      {/* Progress */}
      <div className="text-center">
        <p className="text-zinc-400">
          🔥 Today's Progress
        </p>

        <p className="mt-1 text-4xl font-bold">
          {completedSessions}
        </p>

        <p className="text-sm text-zinc-500">
          Completed Sessions
        </p>
      </div>
    </Card>
  );
}