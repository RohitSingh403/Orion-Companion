// src/pages/Focus/FocusPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import FocusTimer from "../../components/timer/FocusTimer";
import { useTaskStore } from "../../store/taskStore";
import { useFocusStore } from "../../store/focusStore";
import { FiMusic, FiPlay, FiPause } from "react-icons/fi";

export default function FocusPage() {
  const [focusMode, setFocusMode] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { tasks, activeTaskId } = useTaskStore();
  const { completedSessions, focusDuration } = useFocusStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const completedMinutes = Math.floor((completedSessions * focusDuration) / 60);

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
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[10px]">
                  In Progress
                </span>
              </div>

              {activeTask ? (
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{activeTask.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {activeTask.completedFocusSessions} of {activeTask.estimatedFocusSessions} sessions completed
                  </p>
                </div>
              ) : (
                <p className="text-xs text-zinc-500">No active task selected.</p>
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
                  <span className="text-base font-bold text-zinc-100 mt-0.5 block">{completedSessions} / 6</span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Focus Time</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">{completedMinutes}m</span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Tasks Completed</span>
                  <span className="text-base font-bold text-zinc-100 mt-0.5 block">
                    {tasks.filter((t) => t.completed).length} / {tasks.length}
                  </span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">Productivity</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">85%</span>
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