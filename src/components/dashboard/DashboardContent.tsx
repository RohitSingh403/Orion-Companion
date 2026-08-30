// src/components/dashboard/DashboardContent.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../topbar/Topbar";
import { useFocusStore } from "../../store/focusStore";
import { useTaskStore } from "../../store/taskStore";
import { useSettingsStore } from "../../store/settingsStore";
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
  const theme = useSettingsStore((s) => s.theme);

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

  const isDark = theme === "dark";

  return (
    <AppLayout>
      <Topbar greeting="Good Morning, Rohit 👋" subtitle="Let's make today productive!" />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 no-scrollbar">
        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1: Today's Goal */}
          <div className={`p-6 rounded-lg border shadow-sm ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xs font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>Today's Goal</h3>
                <p className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>Focus for {targetHours.toFixed(1)} hours</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                {goalProgress}%
              </span>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}>{completedHours}h</span>
                <span className={`text-xs font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>/ {targetHours.toFixed(1)}h</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${goalProgress}%` }}
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Focus Score */}
          <div className={`p-6 rounded-lg border shadow-sm ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xs font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>Focus Score</h3>
                <p className={`text-xs font-semibold mt-1 ${
                  focusScore >= 80 ? "text-green-600" : focusScore >= 50 ? "text-blue-600" : "text-amber-600"
                }`}>
                  {focusScore >= 80 ? "Great Focus!" : focusScore >= 50 ? "Good Progress!" : "Keep Going!"}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? "bg-gray-700 text-blue-400" : "bg-gray-100 text-blue-600"
              }`}>
                <FiTrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-end justify-between mt-4">
              <div>
                <span className={`text-3xl font-bold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}>{focusScore}</span>
                <p className={`text-[10px] font-medium mt-1 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}>Daily goal progress</p>
              </div>

              {/* Sparkline Visual */}
              <div className="flex items-end gap-1.5 h-8">
                {[40, 60, 50, 75, 90, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1.5 rounded-t-sm transition-all duration-300 ${
                      isDark ? "bg-blue-400/60 hover:bg-blue-400" : "bg-blue-500/60 hover:bg-blue-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Current Streak */}
          <div className={`p-6 rounded-lg border shadow-sm ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xs font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>Current Streak</h3>
                <p className={`text-xs font-semibold mt-1 text-amber-600`}>Keep it up!</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <FiZap className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <span className={`text-3xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>{currentStreak || 12} Days</span>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((day) => (
                  <span
                    key={day}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isDark 
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" 
                        : "bg-blue-50 border border-blue-200 text-blue-600"
                    }`}
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
          <div className={`lg:col-span-6 p-4 md:p-6 rounded-lg border shadow-sm flex flex-col items-center justify-center relative ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className={`text-xs font-bold tracking-wide uppercase ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Focus Timer
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
              }`}>Deep Work Session</span>
            </div>
            <FocusTimer />
          </div>

          {/* Today's Tasks Container (Col 6) */}
          <div className={`lg:col-span-6 p-4 md:p-6 rounded-lg border shadow-sm flex flex-col justify-between space-y-4 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className={`flex items-center justify-between pb-3 ${
              isDark ? "border-gray-700" : "border-gray-200"
            } border-b`}>
              <div>
                <h3 className={`text-sm font-bold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}>Today's Tasks</h3>
                <p className={`text-xs mt-0.5 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  {tasks.filter((t) => t.completed).length} of {tasks.length} completed
                </p>
              </div>
              <Link
                to="/tasks"
                className={`text-xs hover:underline font-medium transition-colors ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                View all
              </Link>
            </div>

            {/* Task List Items */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-48 no-scrollbar pr-1">
              {tasks.length === 0 ? (
                <p className={`text-xs text-center py-6 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  No tasks for today. Add one below!
                </p>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      isDark 
                        ? "hover:bg-gray-700" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                      />
                      <span
                        className={`text-sm font-medium ${
                          task.completed
                            ? isDark ? "line-through text-gray-500" : "line-through text-gray-400"
                            : isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                      isDark 
                        ? "bg-gray-700 text-gray-400" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {task.completedFocusSessions}/{task.estimatedFocusSessions}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add New Task Quick Input */}
            <form onSubmit={handleAddTask} className={`flex gap-2 pt-2 ${
              isDark ? "border-gray-700" : "border-gray-200"
            } border-t`}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="+ Add New Task"
                className={`flex-1 h-9 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500" 
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                } border`}
              />
              <button
                type="submit"
                className="h-9 px-3 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row: Session History */}
        <div className={`p-4 md:p-6 rounded-lg border shadow-sm ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <SessionHistory />
        </div>
      </div>

      <AchievementToast />
      <BreakOverlay visible={session === "break"} remainingTime={remainingTime} />
    </AppLayout>
  );
}