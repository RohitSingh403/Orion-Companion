// src/pages/Tasks/TasksPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useTaskStore } from "../../store/taskStore";
import { useProjectStore } from "../../store/projectStore";
import { useSettingsStore } from "../../store/settingsStore";
import type { TaskPriority, RecurrenceType } from "../../types/task";
import {
  FiCalendar,
  FiStar,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiFolder,
  FiTag,
  FiTarget,
  FiRepeat,
} from "react-icons/fi";

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, setActiveTask, activeTaskId } = useTaskStore();
  const { projects, addProject } = useProjectStore();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";

  const [activeCategory, setActiveCategory] = useState<"today" | "upcoming" | "important" | "completed">("today");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [estimatedSessions, setEstimatedSessions] = useState<number>(2);
  const [selectedTag, setSelectedTag] = useState<string>("Work");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>("");
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#6366f1");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      priority,
      estimatedFocusSessions: estimatedSessions,
      tags: [selectedTag],
      dueDate: "Today",
      recurrence,
      recurrenceEndDate: recurrenceEndDate || null,
      projectId: selectedProjectForTask,
    });

    setTitle("");
    setRecurrence("none");
    setRecurrenceEndDate("");
    setSelectedProjectForTask(null);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    addProject({ name: newProjectName, color: newProjectColor });
    setNewProjectName("");
    setNewProjectColor("#6366f1");
    setShowProjectModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId && t.projectId !== selectedProjectId) return false;
    if (activeCategory === "completed") return t.completed;
    if (activeCategory === "today") return !t.completed;
    if (activeCategory === "important") return t.priority === "high" && !t.completed;
    return !t.completed;
  });

  return (
    <AppLayout>
      <Topbar subtitle="Manage tasks & focus session estimates" />
      <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 overflow-auto">
        {/* Left Sub-Sidebar (Workspace Categories, Projects, Tags) */}
        <div className={`w-full md:w-64 rounded-xl p-4 flex flex-col justify-between flex-shrink-0 space-y-6 border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <div className="space-y-4">
            <h3 className={`text-xs font-semibold uppercase tracking-wider px-2 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}>
              Workspace
            </h3>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveCategory("today")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "today"
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="w-4 h-4" />
                  <span>Today</span>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  isDark 
                    ? "bg-gray-700 text-gray-400" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {tasks.filter((t) => !t.completed).length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("upcoming")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "upcoming"
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="w-4 h-4 text-blue-400" />
                  <span>Upcoming</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("important")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "important"
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiStar className="w-4 h-4 text-amber-400" />
                  <span>Important</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("completed")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "completed"
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Completed</span>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  isDark 
                    ? "bg-gray-700 text-gray-400" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {tasks.filter((t) => t.completed).length}
                </span>
              </button>
            </nav>

            {/* Projects & Tags List */}
            <div className={`pt-4 space-y-3 border-t ${
              isDark 
                ? "border-gray-700" 
                : "border-gray-200"
            }`}>
              <div className="flex items-center justify-between px-2">
                <h4 className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  <FiFolder className="w-3.5 h-3.5" /> Projects
                </h4>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-violet-400" : "text-gray-500 hover:text-violet-600"}`}
                  title="Create project"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
              
              {/* All Tasks Option */}
              <button
                onClick={() => setSelectedProjectId(null)}
                className={`w-full px-2 py-1.5 rounded-lg text-sm flex justify-between items-center transition-all ${
                  selectedProjectId === null
                    ? isDark 
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                    : isDark 
                      ? "text-gray-400 hover:bg-gray-700" 
                      : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>All Tasks</span>
                <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>{tasks.length}</span>
              </button>

              {/* Project List */}
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full px-2 py-1.5 rounded-lg text-sm flex justify-between items-center transition-all ${
                    selectedProjectId === project.id
                      ? isDark 
                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                        : "bg-violet-50 text-violet-600 border border-violet-200"
                      : isDark 
                        ? "text-gray-400 hover:bg-gray-700" 
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {tasks.filter((t) => t.projectId === project.id).length}
                  </span>
                </button>
              ))}

              <h4 className={`text-[11px] font-semibold uppercase tracking-wider px-2 pt-2 flex items-center gap-1.5 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}>
                <FiTag className="w-3.5 h-3.5" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1.5 px-1">
                {["Work", "Personal", "Study", "Health"].map((t) => (
                  <span
                    key={t}
                    onClick={() => setSelectedTag(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer border transition-all ${
                      selectedTag === t
                        ? isDark 
                          ? "bg-violet-500/10 text-violet-400 border border-violet-500/30" 
                          : "bg-violet-50 text-violet-600 border border-violet-200"
                        : isDark 
                          ? "text-gray-400 hover:bg-gray-700" 
                          : "text-gray-600 hover:bg-gray-100"
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
        <div className={`flex-1 rounded-xl p-6 flex flex-col justify-between overflow-auto border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {/* Header & Quick Add Form */}
          <div className="space-y-4">
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark 
                ? "border-gray-700" 
                : "border-gray-200"
            }`}>
              <div>
                <h2 className={`text-base font-semibold capitalize ${isDark ? "text-violet-400" : "text-violet-600"}`}>
                  {activeCategory} Tasks
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {filteredTasks.length} tasks scheduled
                </p>
              </div>
            </div>

            {/* Comprehensive Task Creation Form */}
            <form onSubmit={handleAddTask} className={`p-3 space-y-3 rounded-lg border ${
              isDark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to focus on today?"
                className={`w-full h-9 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                  isDark 
                    ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-violet-500 placeholder-gray-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:border-violet-500 placeholder-gray-400"
                } border`}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Priority Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Priority:</span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className={`rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-violet-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-violet-500"
                      } border`}
                    >
                      <option value="high">High (Red)</option>
                      <option value="medium">Medium (Amber)</option>
                      <option value="low">Low (Green)</option>
                    </select>
                  </div>

                  {/* Sessions Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Est. Sessions:</span>
                    <select
                      value={estimatedSessions}
                      onChange={(e) => setEstimatedSessions(Number(e.target.value))}
                      className={`rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-violet-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-violet-500"
                      } border`}
                    >
                      <option value={1}>1 Session (25m)</option>
                      <option value={2}>2 Sessions (50m)</option>
                      <option value={3}>3 Sessions (75m)</option>
                      <option value={4}>4 Sessions (100m)</option>
                    </select>
                  </div>

                  {/* Project Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Project:</span>
                    <select
                      value={selectedProjectForTask || ""}
                      onChange={(e) => setSelectedProjectForTask(e.target.value || null)}
                      className={`rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-violet-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-violet-500"
                      } border`}
                    >
                      <option value="">None</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recurrence Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <FiRepeat className={`w-3.5 h-3.5 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
                    <select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                      className={`rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                        isDark 
                          ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-violet-500" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-violet-500"
                      } border`}
                    >
                      <option value="none">No Repeat</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 btn-primary text-sm font-medium rounded-lg flex items-center gap-1"
                >
                  <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Recurrence End Date */}
              {recurrence !== "none" && (
                <div className="flex items-center gap-2 text-sm">
                  <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Repeat until:</span>
                  <input
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className={`rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-gray-100 focus:border-violet-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-violet-500"
                    } border`}
                  />
                </div>
              )}
            </form>

            {/* Task Rows List */}
            <div className="space-y-2 overflow-y-auto max-h-[380px] no-scrollbar pr-1">
              {filteredTasks.length === 0 ? (
                <div className={`text-center py-12 border border-dashed rounded-xl ${
                  isDark 
                    ? "border-gray-700 bg-gray-800" 
                    : "border-gray-300 bg-white"
                }`}>
                  <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>No tasks found in this section.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                      activeTaskId === task.id
                        ? isDark 
                          ? "bg-violet-500/10 border-violet-500/40 text-gray-100" 
                          : "bg-violet-50 border-violet-200 text-gray-900"
                        : isDark 
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded accent-violet-500 cursor-pointer"
                      />

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-sm font-medium truncate ${
                            task.completed ? "line-through text-gray-500" : isDark ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {/* Priority Badge */}
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.2 rounded border uppercase ${
                              task.priority === "high"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : task.priority === "medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Project Badge */}
                          {task.projectId && (() => {
                            const project = projects.find((p) => p.id === task.projectId);
                            return project ? (
                              <span
                                className="text-[9px] font-medium px-1.5 py-0.2 rounded border"
                                style={{
                                  backgroundColor: `${project.color}20`,
                                  borderColor: project.color,
                                  color: project.color
                                }}
                              >
                                {project.name}
                              </span>
                            ) : null;
                          })()}

                          {/* Tag Badge */}
                          {task.tags[0] && (
                            <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${
                              isDark 
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/30" 
                                : "bg-purple-50 text-purple-600 border-purple-200"
                            }`}>
                              {task.tags[0]}
                            </span>
                          )}

                          {/* Recurrence Badge */}
                          {task.recurrence && task.recurrence !== "none" && (
                            <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded border flex items-center gap-1 ${
                              isDark 
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30" 
                                : "bg-blue-50 text-blue-600 border-blue-200"
                            }`}>
                              <FiRepeat className="w-2.5 h-2.5" />
                              {task.recurrence}
                            </span>
                          )}

                          <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Due: Today</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Focus Session Counter */}
                      <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg ${
                        isDark 
                          ? "bg-gray-600 text-gray-400" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {task.completedFocusSessions}/{task.estimatedFocusSessions}
                      </span>

                      {/* Set Active Task for Timer */}
                      <button
                        onClick={() => setActiveTask(task.id)}
                        title="Set active for focus timer"
                        className={`p-1.5 rounded-lg border transition-all ${
                          activeTaskId === task.id
                            ? "btn-primary border-violet-500"
                            : isDark 
                              ? "text-gray-400 hover:text-gray-100 hover:bg-gray-600" 
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Task */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`p-1.5 transition-colors ${isDark ? "text-gray-500 hover:text-red-400" : "text-gray-500 hover:text-red-600"}`}
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

        {/* Project Creation Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`p-6 w-full max-w-md space-y-4 rounded-xl border shadow-sm ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${isDark ? "text-violet-400" : "text-violet-600"}`}>Create Project</h3>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className={`transition-colors ${isDark ? "text-gray-500 hover:text-gray-100" : "text-gray-500 hover:text-gray-900"}`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium mb-1 block ${isDark ? "text-gray-500" : "text-gray-500"}`}>Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className={`w-full h-9 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500 placeholder-gray-500" 
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500 placeholder-gray-400"
                    } border`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1 block ${isDark ? "text-gray-500" : "text-gray-500"}`}>Project Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newProjectColor}
                      onChange={(e) => setNewProjectColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>{newProjectColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 px-4 py-2 btn-secondary rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 px-4 py-2 btn-primary rounded-lg text-sm font-medium"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}