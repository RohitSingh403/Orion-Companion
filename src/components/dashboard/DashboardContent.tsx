// src/components/dashboard/DashboardContent.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../topbar/Topbar";
import { useFocusStore } from "../../store/focusStore";
import { useTaskStore } from "../../store/taskStore";
import FocusTimer from "../timer/FocusTimer";
import SessionHistory from "../history/SessionHistory";
import BreakOverlay from "../overlay/BreakOverlay";
import AchievementToast from "../ui/AchievementToast";
import { FiTrendingUp, FiZap, FiPlus, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function DashboardContent() {
  const {
    session,
    remainingTime,
    completedSessions,
    focusDuration,
    dailyGoal,
    currentStreak,
  } = useFocusStore();

  const { tasks, toggleTask, addTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const completedHours = ((completedSessions * focusDuration) / 3600).toFixed(1);
  const goalProgress = Math.min(Math.round((completedSessions / dailyGoal) * 100), 100);
  const targetHours = (dailyGoal * focusDuration) / 3600;
  const focusScore = dailyGoal > 0 ? Math.min(Math.round((completedSessions / dailyGoal) * 100), 100) : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle });
    setNewTaskTitle("");
  };

  return (
    <AppLayout>
      <Topbar greeting="Good Morning, Rohit 👋" subtitle="Let's make today productive!" />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 no-scrollbar">
        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1: Today's Goal */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-400">Today's Goal</h3>
                <p className="text-xs text-zinc-500">Focus for {targetHours.toFixed(1)} hours</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {goalProgress}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-100">{completedHours}h</span>
                <span className="text-xs text-zinc-400 font-medium">/ {targetHours.toFixed(1)}h</span>
              </div>

              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  style={{ width: `${goalProgress}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Focus Score */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-400">Focus Score</h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  {focusScore >= 80 ? "Great Focus!" : focusScore >= 50 ? "Good Progress!" : "Keep Going!"}
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-emerald">
                <FiTrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-zinc-100">{focusScore}</span>
                <p className="text-[10px] text-emerald-400 font-medium mt-1">Daily goal progress</p>
              </div>

              {/* Sparkline Visual */}
              <div className="flex items-end gap-1 h-8">
                {[40, 60, 50, 75, 90, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-emerald-500/80 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Current Streak */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-400">Current Streak</h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">Keep it up!</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FiZap className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-bold text-zinc-100">{currentStreak || 12} Days</span>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((day) => (
                  <span
                    key={day}
                    className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px]"
                  >
                    <FiCheckCircle className="w-3 h-3" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Focus Timer & Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Focus Timer Container (Col 6) */}
          <div className="lg:col-span-6 glass-card p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center relative">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-300 tracking-wide uppercase">
                Focus Timer
              </h3>
              <span className="text-[10px] text-zinc-500">Deep Work Session</span>
            </div>
            <FocusTimer />
          </div>

          {/* Today's Tasks Container (Col 6) */}
          <div className="lg:col-span-6 glass-card p-4 md:p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Today's Tasks</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {tasks.filter((t) => t.completed).length} of {tasks.length} completed
                </p>
              </div>
              <Link
                to="/tasks"
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                View all
              </Link>
            </div>

            {/* Task List Items */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-48 no-scrollbar pr-1">
              {tasks.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">
                  No tasks for today. Add one below!
                </p>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <span
                        className={`text-xs font-medium ${
                          task.completed
                            ? "line-through text-zinc-500"
                            : "text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                      {task.completedFocusSessions}/{task.estimatedFocusSessions}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add New Task Quick Input */}
            <form onSubmit={handleAddTask} className="flex gap-2 pt-2 border-t border-zinc-800/80">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="+ Add New Task"
                className="flex-1 h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                className="h-9 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-semibold transition"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row: Session History */}
        <div className="glass-card p-4 md:p-6 rounded-2xl">
          <SessionHistory />
        </div>
      </div>

      <AchievementToast />
      <BreakOverlay visible={session === "break"} remainingTime={remainingTime} />
    </AppLayout>
  );
}