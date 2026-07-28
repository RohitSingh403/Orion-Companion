// src/pages/Focus/FocusPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import FocusTimer from "../../components/timer/FocusTimer";
import { useTaskStore } from "../../store/taskStore";
import { useFocusStore } from "../../store/focusStore";
import { FiMusic, FiPlay, FiPause, FiArrowRight, FiTarget } from "react-icons/fi";

export default function FocusPage() {
  const [focusMode, setFocusMode] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { tasks, activeTaskId } = useTaskStore();
  const { completedSessions, focusDuration, dailyGoal } = useFocusStore();

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
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <AppLayout>
      <Topbar greeting="Deep Work Mode 🎯" subtitle="Distraction-free focus environment" />
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
        {/* Top Header Banner & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between glass-card p-4 rounded-2xl gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Deep Work</h2>
            <p className="text-xs text-zinc-400">Build amazing things with focused attention</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-400">Focus Mode</span>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                focusMode ? "bg-emerald-500" : "bg-zinc-800"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-zinc-950 shadow transition-transform ${
                  focusMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Main Grid: Timer on Left (Col 7), Context Panel on Right (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Focus Ring Timer */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl flex flex-col items-center justify-center min-h-[420px] relative">
            <FocusTimer />
          </div>

          {/* Right Column: Task context, Today's stats, Background sound */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Current Task */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold uppercase tracking-wider">Current Task</span>
                {activeTask ? (
                  <span className={`px-2 py-0.5 rounded font-semibold border text-[10px] ${getPriorityColor(activeTask.priority)}`}>
                    {activeTask.priority.toUpperCase()}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-zinc-500/10 text-zinc-400 font-semibold border border-zinc-500/20 text-[10px]">
                    NONE
                  </span>
                )}
              </div>

              {activeTask ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-100">{activeTask.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-400">
                        {activeTask.completedFocusSessions} of {activeTask.estimatedFocusSessions} sessions
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                        {getTaskProgress()}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      style={{ width: `${getTaskProgress()}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    />
                  </div>
                  {/* Tags */}
                  {activeTask.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeTask.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500">No active task selected.</p>
                  <Link
                    to="/tasks"
                    className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
                  >
                    <FiTarget className="w-3.5 h-3.5" />
                    <span>Select a task</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Card 2: Today's Progress Stats */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-2">
                Today's Progress
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Focus Sessions</span>
                  <span className="text-base font-bold text-zinc-100 mt-0.5 block">{completedSessions} / {dailyGoal}</span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Focus Time</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">{focusTimeDisplay}</span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Tasks Completed</span>
                  <span className="text-base font-bold text-zinc-100 mt-0.5 block">
                    {tasks.filter((t) => t.completed).length} / {tasks.length}
                  </span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Productivity</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">{productivityScore}%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Background Sound Controls */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiMusic className="text-emerald-400 w-4 h-4" />
                  <span className="text-xs font-bold text-zinc-200">Background Sound</span>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 flex items-center justify-center transition shadow glow-emerald"
                >
                  {isPlayingAudio ? <FiPause className="w-4 h-4 fill-current" /> : <FiPlay className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                <span className="text-xs font-medium text-zinc-300">Lo-Fi Beats</span>
                {/* Audio visualizer animation bars */}
                <div className="flex items-end gap-1 h-4">
                  {[40, 80, 50, 90, 60].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: isPlayingAudio ? `${h}%` : "20%" }}
                      className="w-1 bg-emerald-400 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}