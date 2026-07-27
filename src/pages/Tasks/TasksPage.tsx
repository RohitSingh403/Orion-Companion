// src/pages/Tasks/TasksPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useTaskStore } from "../../store/taskStore";
import type { TaskPriority } from "../../types/task";
import {
  FiCalendar,
  FiStar,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiFolder,
  FiTag,
  FiTarget,
} from "react-icons/fi";

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, setActiveTask, activeTaskId } = useTaskStore();

  const [activeCategory, setActiveCategory] = useState<"today" | "upcoming" | "important" | "completed">("today");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [estimatedSessions, setEstimatedSessions] = useState<number>(2);
  const [selectedTag, setSelectedTag] = useState<string>("Work");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      priority,
      estimatedFocusSessions: estimatedSessions,
      tags: [selectedTag],
      dueDate: "Today",
    });

    setTitle("");
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeCategory === "completed") return t.completed;
    if (activeCategory === "today") return !t.completed;
    if (activeCategory === "important") return t.priority === "high" && !t.completed;
    return !t.completed;
  });

  return (
    <AppLayout>
      <Topbar greeting="Workspace Tasks 💼" subtitle="Manage tasks & focus session estimates" />
      <div className="flex-1 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6">
        {/* Left Sub-Sidebar (Workspace Categories, Projects, Tags) */}
        <div className="w-full md:w-64 glass-card rounded-2xl p-4 flex flex-col justify-between flex-shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
              Workspace
            </h3>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveCategory("today")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  activeCategory === "today"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="w-4 h-4" />
                  <span>Today</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {tasks.filter((t) => !t.completed).length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("upcoming")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  activeCategory === "upcoming"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="w-4 h-4 text-blue-400" />
                  <span>Upcoming</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("important")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  activeCategory === "important"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiStar className="w-4 h-4 text-amber-400" />
                  <span>Important</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("completed")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  activeCategory === "completed"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Completed</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {tasks.filter((t) => t.completed).length}
                </span>
              </button>
            </nav>

            {/* Projects & Tags List */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-2 flex items-center gap-1.5">
                <FiFolder className="w-3.5 h-3.5" /> Projects
              </h4>
              <div className="px-2 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 flex justify-between items-center">
                <span>Project Apollo</span>
                <span className="text-[10px] text-zinc-500">4 tasks</span>
              </div>

              <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-2 pt-2 flex items-center gap-1.5">
                <FiTag className="w-3.5 h-3.5" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1.5 px-1">
                {["Work", "Personal", "Study", "Health"].map((t) => (
                  <span
                    key={t}
                    onClick={() => setSelectedTag(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer border transition ${
                      selectedTag === t
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Task List & Creation Panel */}
        <div className="flex-1 glass-card rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
          {/* Header & Quick Add Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-100 capitalize">
                  {activeCategory} Tasks
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {filteredTasks.length} tasks scheduled
                </p>
              </div>
            </div>

            {/* Comprehensive Task Creation Form */}
            <form onSubmit={handleAddTask} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to focus on today?"
                className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Priority Select */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-zinc-500 text-[10px]">Priority:</span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                    >
                      <option value="high">High (Red)</option>
                      <option value="medium">Medium (Amber)</option>
                      <option value="low">Low (Green)</option>
                    </select>
                  </div>

                  {/* Sessions Select */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-zinc-500 text-[10px]">Est. Sessions:</span>
                    <select
                      value={estimatedSessions}
                      onChange={(e) => setEstimatedSessions(Number(e.target.value))}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                    >
                      <option value={1}>1 Session (25m)</option>
                      <option value={2}>2 Sessions (50m)</option>
                      <option value={3}>3 Sessions (75m)</option>
                      <option value={4}>4 Sessions (100m)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-semibold rounded-lg flex items-center gap-1 shadow glow-emerald"
                >
                  <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Task</span>
                </button>
              </div>
            </form>

            {/* Task Rows List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[380px] no-scrollbar pr-1">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500">No tasks found in this section.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                      activeTaskId === task.id
                        ? "bg-emerald-500/10 border-emerald-500/40 text-zinc-100 shadow-sm"
                        : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-xs font-semibold truncate ${
                            task.completed ? "line-through text-zinc-500" : "text-zinc-200"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {/* Priority Badge */}
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border uppercase ${
                              task.priority === "high"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : task.priority === "medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Tag Badge */}
                          {task.tags[0] && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {task.tags[0]}
                            </span>
                          )}

                          <span className="text-[10px] text-zinc-500">Due: Today</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Focus Session Counter */}
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                        {task.completedFocusSessions}/{task.estimatedFocusSessions}
                      </span>

                      {/* Set Active Task for Timer */}
                      <button
                        onClick={() => setActiveTask(task.id)}
                        title="Set active for focus timer"
                        className={`p-1.5 rounded-lg border transition ${
                          activeTaskId === task.id
                            ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Task */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}