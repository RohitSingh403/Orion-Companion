// src/pages/Focus/FocusPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import FocusTimer from "../../components/timer/FocusTimer";
import { useTaskStore } from "../../store/taskStore";
import { useFocusStore } from "../../store/focusStore";
import { FiMusic, FiPlay, FiPause, FiArrowRight, FiTarget, FiMaximize, FiMinimize, FiVolume2, FiWind } from "react-icons/fi";

export default function FocusPage() {
  const [focusMode, setFocusMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volume, setVolume] = useState(70);
  const [ambientEffect, setAmbientEffect] = useState("none");
  const { tasks, activeTaskId } = useTaskStore();
  const { running, session, completedSessions, focusDuration, dailyGoal } = useFocusStore();

  const activeTask = tasks.find((t: any) => t.id === activeTaskId);
  const completedMinutes = Math.floor((completedSessions * focusDuration) / 60);
  const completedHours = Math.floor(completedMinutes / 60);
  const completedMinutesRemainder = completedMinutes % 60;
  const focusTimeDisplay = completedHours > 0 ? `${completedHours}h ${completedMinutesRemainder}m` : `${completedMinutes}m`;

  // Calculate productivity score based on daily goal completion
  const productivityScore = dailyGoal > 0 ? Math.min(Math.round((completedSessions / dailyGoal) * 100), 100) : 0;

  // Calculate task progress percentage
  const getTaskProgress = () => {
    if (!activeTask) return 0;
    return Math.min(
      Math.round((activeTask.completedFocusSessions / activeTask.estimatedFocusSessions) * 100),
      100
    );
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "low":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-white/5 text-secondary border-white/10";
    }
  };

  // Ambient background gradient based on session state
  const getAmbientGradient = () => {
    if (focusMode) {
      if (running && session === "focus") {
        return "from-emerald-900/10 via-transparent to-teal-900/10";
      } else if (session === "break") {
        return "from-blue-900/10 via-transparent to-purple-900/10";
      }
      return "from-zinc-900/5 via-transparent to-zinc-900/5";
    }
    return "from-transparent via-transparent to-transparent";
  };

  return (
    <AppLayout>
      <Topbar subtitle="Distraction-free focus environment" />
      
      {/* Ambient Background Effect */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 bg-gradient-to-br ${getAmbientGradient()}`} />

      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-auto no-scrollbar relative">
        {/* Top Header Banner & Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between card-elevated p-4 gap-4"
        >
          <div>
            <h2 className="text-lg font-semibold text-accent">Deep Work</h2>
            <p className="text-xs text-secondary">Build amazing things with focused attention</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Ambient Effect Selector */}
            <div className="flex items-center gap-2">
              <FiWind className="w-4 h-4 text-secondary" />
              <select
                value={ambientEffect}
                onChange={(e) => setAmbientEffect(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-primary focus:outline-none focus:border-accent/50"
              >
                <option value="none">None</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
                <option value="nature">Nature</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-secondary">Focus Mode</span>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`toggle ${focusMode ? "active" : ""}`}
              >
              </button>
            </div>

            <button
              onClick={() => setFocusMode(!focusMode)}
              className="icon-btn"
              title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {focusMode ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Main Grid: Timer on Left (Col 7), Context Panel on Right (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Focus Ring Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 card-elevated p-8 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden"
          >
            {/* Ambient glow effect when running */}
            <AnimatePresence>
              {running && session === "focus" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-teal-500/20 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <div className="relative z-10">
              <FocusTimer />
            </div>

            {/* Session status indicator */}
            <motion.div
              animate={running ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-secondary"
            >
              {running ? "In Progress" : "Paused"}
            </motion.div>
          </motion.div>

          {/* Right Column: Task context, Today's stats, Background sound */}
          <AnimatePresence mode="wait">
            {!focusMode ? (
              <motion.div
                key="panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-5 space-y-6"
              >
                {/* Card 1: Current Task */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-elevated p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <span className="font-medium uppercase tracking-wider">Current Task</span>
                    {activeTask ? (
                      <span className={`px-2 py-0.5 rounded font-medium border text-[10px] badge ${getPriorityColor(activeTask.priority)}`}>
                        {activeTask.priority.toUpperCase()}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded badge text-secondary font-medium text-[10px]">
                        NONE
                      </span>
                    )}
                  </div>

                  {activeTask ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-primary">{activeTask.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-secondary">
                            {activeTask.completedFocusSessions} of {activeTask.estimatedFocusSessions} sessions
                          </span>
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded badge">
                            {getTaskProgress()}%
                          </span>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="progress w-full">
                        <div
                          style={{ width: `${getTaskProgress()}%` }}
                          className="progress-bar transition-all duration-500"
                        />
                      </div>
                      {/* Tags */}
                      {activeTask.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {activeTask.tags.map((tag: string) => (
                            <span key={tag} className="text-[9px] font-medium px-1.5 py-0.2 rounded badge text-purple-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-muted">No active task selected.</p>
                      <Link
                        to="/tasks"
                        className="flex items-center gap-2 text-xs text-accent hover:underline font-medium transition-colors"
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                        <span>Select a task</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </motion.div>

                {/* Card 2: Today's Progress Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card-elevated p-5 space-y-3"
                >
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider border-b border-white/6 pb-2">
                    Today's Progress
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="card p-3">
                      <span className="text-muted text-[10px] block">Focus Sessions</span>
                      <span className="text-base font-semibold text-accent mt-0.5 block">{completedSessions} / {dailyGoal}</span>
                    </div>
                    <div className="card p-3">
                      <span className="text-muted text-[10px] block">Focus Time</span>
                      <span className="text-base font-semibold text-accent mt-0.5 block">{focusTimeDisplay}</span>
                    </div>
                    <div className="card p-3">
                      <span className="text-muted text-[10px] block">Tasks Completed</span>
                      <span className="text-base font-semibold text-accent mt-0.5 block">
                        {tasks.filter((t: any) => t.completed).length} / {tasks.length}
                      </span>
                    </div>
                    <div className="card p-3">
                      <span className="text-muted text-[10px] block">Productivity</span>
                      <span className="text-base font-semibold text-accent mt-0.5 block">{productivityScore}%</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Background Sound Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-elevated p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiMusic className="text-accent w-4 h-4" />
                      <span className="text-xs font-semibold text-primary">Background Sound</span>
                    </div>
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full btn-primary flex items-center justify-center"
                    >
                      {isPlayingAudio ? <FiPause className="w-4 h-4 fill-current" /> : <FiPlay className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <FiVolume2 className="w-4 h-4 text-secondary" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <span className="text-xs text-secondary w-8 text-right">{volume}%</span>
                  </div>

                  <div className="flex items-center justify-between card p-3">
                    <span className="text-xs font-medium text-primary">Lo-Fi Beats</span>
                    {/* Audio visualizer animation bars */}
                    <div className="flex items-end gap-1.5 h-4">
                      {[40, 80, 50, 90, 60].map((h, idx) => (
                        <motion.div
                          key={idx}
                          animate={isPlayingAudio ? { height: [`${h}%`, `${h * 0.5}%`, `${h}%`] } : { height: "20%" }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: idx * 0.1 }}
                          className="w-1 bg-accent/60 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="focus-message"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-5"
              >
                <div className="card-elevated p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <FiTarget className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Focus Mode Active</h3>
                    <p className="text-sm text-secondary mt-2">
                      Minimize distractions and stay in the zone. Toggle focus mode off to see your task details and progress.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-muted">
                      Press <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px]">Esc</kbd> to exit focus mode
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}