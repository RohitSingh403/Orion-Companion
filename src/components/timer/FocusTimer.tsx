import { motion, AnimatePresence } from "framer-motion";

import Card from "../ui/Card";
import Button from "../ui/Button";
import ProgressRing from "./ProgressRing";

import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

import { useFocusStore } from "../../store/focusStore";

export default function FocusTimer() {
  const { session, running, completedSessions, start, pause, reset } =
    useFocusStore();

  return (
    <Card className="w-full max-w-4xl">
      {/* Animated Header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={session}
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 15,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <h1 className="text-center text-3xl font-bold">🧠 Focus Companion</h1>

          <p className="mt-1 text-center text-zinc-400 capitalize">
            {session} Session
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Animated Progress Ring */}
      <motion.div
        className="my-5 flex justify-center"
        animate={{
          scale: running ? 1.03 : 1,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <ProgressRing />
      </motion.div>

      {/* Animated Controls */}
      <motion.div layout className="flex justify-center gap-3">
        {!running ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={start}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <FaPlay />
              Start
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={pause}
              className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
            >
              <FaPause />
              Pause
            </Button>
          </motion.div>
        )}

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={reset}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <FaRedo />
            Reset
          </Button>
        </motion.div>
      </motion.div>

      {/* Divider */}
      <div className="my-6 h-px bg-zinc-800" />

      {/* Animated Stats */}
      <motion.div layout className="text-center">
        <p className="text-zinc-400">🔥 Today's Progress</p>

        <motion.p
          key={completedSessions}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-4xl font-bold"
        >
          {completedSessions}
        </motion.p>

        <p className="text-sm text-zinc-500">Completed Sessions</p>
      </motion.div>
    </Card>
  );
}
