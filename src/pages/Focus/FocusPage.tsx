// src/pages/Focus/FocusPage.tsx

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import FocusTimer from "../../components/timer/FocusTimer";
import { useTaskStore } from "../../store/taskStore";
import { useFocusStore } from "../../store/focusStore";
import { useSettingsStore } from "../../store/settingsStore";
import { FiMusic, FiPlay, FiPause, FiArrowRight, FiTarget, FiMaximize, FiMinimize, FiVolume2, FiWind, FiClock, FiList, FiCheckCircle, FiZap } from "react-icons/fi";

export default function FocusPage() {
  const [focusMode, setFocusMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volume, setVolume] = useState(70);
  const [ambientEffect, setAmbientEffect] = useState("none");
  const [showTaskQueue, setShowTaskQueue] = useState(true);
  const { tasks, activeTaskId, setActiveTask } = useTaskStore();
  const { running, session, completedSessions, focusDuration, dailyGoal, history } = useFocusStore();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

  const activeTask = tasks.find((t) => t.id === activeTaskId);
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
        return isDark ? "bg-gray-700/50 text-gray-400 border-gray-600" : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Get task queue (upcoming incomplete tasks)
  const taskQueue = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.id !== activeTaskId)
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 };
        const priorityDiff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
        if (priorityDiff !== 0) return priorityDiff;
        // Then by estimated sessions
        return a.estimatedFocusSessions - b.estimatedFocusSessions;
      })
      .slice(0, 5);
  }, [tasks, activeTaskId]);

  // Get recent session history
  const recentSessions = useMemo(() => {
    return history.slice(0, 5);
  }, [history]);

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
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 rounded-xl border shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-violet-400" : "text-violet-600"}`}>Deep Work</h2>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Build amazing things with focused attention</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Ambient Effect Selector */}
            <div className="flex items-center gap-2">
              <FiWind className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
              <select
                value={ambientEffect}
                onChange={(e) => setAmbientEffect(e.target.value)}
                className={`rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                    : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                } border`}
              >
                <option value="none">None</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
                <option value="nature">Nature</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>Focus Mode</span>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`toggle ${focusMode ? "active" : ""}`}
              >
              </button>
            </div>

            <button
              onClick={() => setFocusMode(!focusMode)}
              className="icon-btn focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {focusMode ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Main Grid: Timer on Left (Col 8), Context Panel on Right (Col 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Enhanced Focus Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`lg:col-span-8 p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden rounded-xl border shadow-sm ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}
          >
            {/* Ambient glow effect when running */}
            <AnimatePresence>
              {running && session === "focus" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
                    isDark ? "from-violet-500/20 via-transparent to-pink-500/20" : "from-violet-500/10 via-transparent to-pink-500/10"
                  }`}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-lg">
              <FocusTimer />
              
              {/* Session Progress Ring */}
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDark ? "text-violet-400" : "text-violet-600"}`}>{completedSessions}</div>
                  <div className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Sessions Today</div>
                </div>
                <div className={`w-px h-12 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{productivityScore}%</div>
                  <div className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Daily Goal</div>
                </div>
                <div className={`w-px h-12 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>{focusTimeDisplay}</div>
                  <div className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Focus Time</div>
                </div>
              </div>
            </div>

            {/* Session status indicator */}
            <motion.div
              animate={running ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-medium ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-400" 
                  : "bg-gray-100 border-gray-200 text-gray-600"
              }`}
            >
              {running ? "In Progress" : "Paused"}
            </motion.div>
          </motion.div>

          {/* Right Column: Enhanced Context Panel */}
          <AnimatePresence mode="wait">
            {!focusMode ? (
              <motion.div
                key="panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-4 space-y-4"
              >
                {/* Card 1: Current Task */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-5 space-y-3 rounded-xl border shadow-sm ${
                    isDark 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className={`flex items-center justify-between text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <span className="font-medium uppercase tracking-wider">Current Task</span>
                    {activeTask ? (
                      <span className={`px-2 py-0.5 rounded font-medium border text-[10px] badge ${getPriorityColor(activeTask.priority)}`}>
                        {activeTask.priority.toUpperCase()}
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded badge font-medium text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        NONE
                      </span>
                    )}
                  </div>

                  {activeTask ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{activeTask.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
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
                            <span key={tag} className={`text-[9px] font-medium px-1.5 py-0.2 rounded badge ${isDark ? "text-violet-300" : "text-violet-600"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>No active task selected.</p>
                      <Link
                        to="/tasks"
                        className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDark ? "text-violet-400 hover:underline" : "text-violet-600 hover:underline"}`}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                        <span>Select a task</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </motion.div>

                {/* Card 2: Task Queue */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-5 space-y-3 rounded-xl border shadow-sm ${
                    isDark 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      <FiList className="w-3.5 h-3.5" />
                      Upcoming Tasks
                    </h4>
                    <button
                      onClick={() => setShowTaskQueue(!showTaskQueue)}
                      className={`transition-colors ${isDark ? "text-gray-500 hover:text-gray-100" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      {showTaskQueue ? <FiMinimize className="w-3.5 h-3.5" /> : <FiMaximize className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showTaskQueue && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {taskQueue.length === 0 ? (
                          <p className={`text-xs text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>No upcoming tasks</p>
                        ) : (
                          taskQueue.map((task, idx) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                isDark 
                                  ? "hover:bg-gray-700" 
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => setActiveTask(task.id)}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className={`text-[10px] font-mono ${isDark ? "text-gray-500" : "text-gray-500"}`}>#{idx + 1}</span>
                                <span className={`text-xs font-medium truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}>{task.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded border uppercase badge ${getPriorityColor(task.priority)}`}>
                                  {task.priority[0]}
                                </span>
                                <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>{task.estimatedFocusSessions}×</span>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Card 3: Session History */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-5 space-y-3 rounded-xl border shadow-sm ${
                    isDark 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h4 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    <FiClock className="w-3.5 h-3.5" />
                    Recent Sessions
                  </h4>

                  <div className="space-y-2">
                    {recentSessions.length === 0 ? (
                      <p className={`text-xs text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>No sessions yet</p>
                    ) : (
                      recentSessions.map((session, idx) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            isDark 
                              ? "bg-gray-700/50 border border-gray-700" 
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className={`w-3 h-3 ${isDark ? "text-violet-400" : "text-violet-600"}`} />
                            <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>{session.time}</span>
                          </div>
                          <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>{Math.round(session.duration / 60)}m</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>

                {/* Card 4: Background Sound Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className={`p-5 space-y-3 rounded-xl border shadow-sm ${
                    isDark 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiMusic className={`w-4 h-4 ${isDark ? "text-violet-400" : "text-violet-600"}`} />
                      <span className={`text-xs font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Background Sound</span>
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
                    <FiVolume2 className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <span className={`text-xs w-8 text-right ${isDark ? "text-gray-500" : "text-gray-500"}`}>{volume}%</span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <span className={`text-xs font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>Lo-Fi Beats</span>
                    {/* Audio visualizer animation bars */}
                    <div className="flex items-end gap-1.5 h-4">
                      {[40, 80, 50, 90, 60].map((h, idx) => (
                        <motion.div
                          key={idx}
                          animate={isPlayingAudio ? { height: [`${h}%`, `${h * 0.5}%`, `${h}%`] } : { height: "20%" }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: idx * 0.1 }}
                          className={`w-1 rounded-full ${isDark ? "bg-violet-400/60" : "bg-violet-500/60"}`}
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
                className="lg:col-span-4"
              >
                <div className={`p-8 text-center space-y-4 rounded-xl border shadow-sm ${
                  isDark 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}>
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    isDark 
                      ? "bg-violet-500/10 border border-violet-500/30" 
                      : "bg-violet-50 border border-violet-200"
                  }`}>
                    <FiZap className={`w-8 h-8 ${isDark ? "text-violet-400" : "text-violet-600"}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Focus Mode Active</h3>
                    <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      Minimize distractions and stay in the zone. Toggle focus mode off to see your task details and progress.
                    </p>
                  </div>
                  <div className={`pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      Press <kbd className={`px-2 py-1 rounded text-[10px] ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>Esc</kbd> to exit focus mode
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