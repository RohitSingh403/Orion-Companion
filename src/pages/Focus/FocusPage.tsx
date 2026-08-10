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
        return "bg-white/5 text-secondary border-white/10";
    }
  };

  return (
    <AppLayout>
      <Topbar greeting="Deep Work Mode 🎯" subtitle="Distraction-free focus environment" />
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
        {/* Top Header Banner & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between card-elevated p-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-accent">Deep Work</h2>
            <p className="text-xs text-secondary">Build amazing things with focused attention</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-secondary">Focus Mode</span>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`toggle ${focusMode ? "active" : ""}`}
            >
            </button>
          </div>
        </div>

        {/* Main Grid: Timer on Left (Col 7), Context Panel on Right (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Focus Ring Timer */}
          <div className="lg:col-span-7 card-elevated p-8 flex flex-col items-center justify-center min-h-[420px] relative">
            <FocusTimer />
          </div>

          {/* Right Column: Task context, Today's stats, Background sound */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Current Task */}
            <div className="card-elevated p-5 space-y-3">
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
                      {activeTask.tags.map((tag) => (
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
            </div>

            {/* Card 2: Today's Progress Stats */}
            <div className="card-elevated p-5 space-y-3">
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
                    {tasks.filter((t) => t.completed).length} / {tasks.length}
                  </span>
                </div>
                <div className="card p-3">
                  <span className="text-muted text-[10px] block">Productivity</span>
                  <span className="text-base font-semibold text-accent mt-0.5 block">{productivityScore}%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Background Sound Controls */}
            <div className="card-elevated p-5 space-y-3">
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

              <div className="flex items-center justify-between card p-3">
                <span className="text-xs font-medium text-primary">Lo-Fi Beats</span>
                {/* Audio visualizer animation bars */}
                <div className="flex items-end gap-1.5 h-4">
                  {[40, 80, 50, 90, 60].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: isPlayingAudio ? `${h}%` : "20%" }}
                      className="w-1 bg-accent/60 rounded-full transition-all duration-300"
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