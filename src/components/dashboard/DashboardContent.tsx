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
          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-secondary">Today's Goal</h3>
                <p className="text-xs text-muted">Focus for {targetHours.toFixed(1)} hours</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded badge-success text-accent">
                {goalProgress}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-accent">{completedHours}h</span>
                <span className="text-xs text-secondary font-medium">/ {targetHours.toFixed(1)}h</span>
              </div>

              <div className="progress w-full">
                <div
                  style={{ width: `${goalProgress}%` }}
                  className="progress-bar transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Focus Score */}
          <div className="card-elevated p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-secondary">Focus Score</h3>
                <p className="text-xs text-accent font-semibold mt-0.5">
                  {focusScore >= 80 ? "Great Focus!" : focusScore >= 50 ? "Good Progress!" : "Keep Going!"}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                <FiTrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-accent">{focusScore}</span>
                <p className="text-[10px] text-accent font-medium mt-1">Daily goal progress</p>
              </div>

              {/* Sparkline Visual */}
              <div className="flex items-end gap-1.5 h-8">
                {[40, 60, 50, 75, 90, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-accent/60 rounded-t-sm transition-all duration-300 hover:bg-accent"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Current Streak */}
          <div className="card-elevated p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-secondary">Current Streak</h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">Keep it up!</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                <FiZap className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-bold text-accent">{currentStreak || 12} Days</span>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((day) => (
                  <span
                    key={day}
                    className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center text-[10px]"
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
          <div className="lg:col-span-6 card-elevated p-4 md:p-6 flex flex-col items-center justify-center relative">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-secondary tracking-wide uppercase">
                Focus Timer
              </h3>
              <span className="text-[10px] text-muted badge">Deep Work Session</span>
            </div>
            <FocusTimer />
          </div>

          {/* Today's Tasks Container (Col 6) */}
          <div className="lg:col-span-6 card-elevated p-4 md:p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/6 pb-3">
              <div>
                <h3 className="text-sm font-bold text-primary">Today's Tasks</h3>
                <p className="text-xs text-muted mt-0.5">
                  {tasks.filter((t) => t.completed).length} of {tasks.length} completed
                </p>
              </div>
              <Link
                to="/tasks"
                className="text-xs text-accent hover:underline font-medium transition-colors"
              >
                View all
              </Link>
            </div>

            {/* Task List Items */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-48 no-scrollbar pr-1">
              {tasks.length === 0 ? (
                <p className="text-xs text-muted text-center py-6">
                  No tasks for today. Add one below!
                </p>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 card hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded accent-accent cursor-pointer"
                      />
                      <span
                        className={`text-sm font-medium ${
                          task.completed
                            ? "line-through text-muted"
                            : "text-primary"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded badge">
                      {task.completedFocusSessions}/{task.estimatedFocusSessions}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add New Task Quick Input */}
            <form onSubmit={handleAddTask} className="flex gap-2 pt-2 border-t border-white/6">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="+ Add New Task"
                className="flex-1 h-9 px-3 input rounded-lg text-sm text-primary placeholder-muted"
              />
              <button
                type="submit"
                className="h-9 px-3 btn-primary rounded-lg text-sm font-medium"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row: Session History */}
        <div className="card-elevated p-4 md:p-6">
          <SessionHistory />
        </div>
      </div>

      <AchievementToast />
      <BreakOverlay visible={session === "break"} remainingTime={remainingTime} />
    </AppLayout>
  );
}