// src/pages/Tasks/TasksPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useTaskStore } from "../../store/taskStore";
import { useProjectStore } from "../../store/projectStore";
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
        <div className="w-full md:w-64 card-elevated rounded-xl p-4 flex flex-col justify-between flex-shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider px-2">
              Workspace
            </h3>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveCategory("today")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "today"
                    ? "bg-white/10 text-white"
                    : "text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="w-4 h-4" />
                  <span>Today</span>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded badge text-secondary">
                  {tasks.filter((t) => !t.completed).length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("upcoming")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "upcoming"
                    ? "bg-white/10 text-white"
                    : "text-secondary hover:bg-white/5 hover:text-white"
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
                    ? "bg-white/10 text-white"
                    : "text-secondary hover:bg-white/5 hover:text-white"
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
                    ? "bg-white/10 text-white"
                    : "text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiCheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Completed</span>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded badge text-secondary">
                  {tasks.filter((t) => t.completed).length}
                </span>
              </button>
            </nav>

            {/* Projects & Tags List */}
            <div className="pt-4 border-t border-white/6 space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FiFolder className="w-3.5 h-3.5" /> Projects
                </h4>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="text-muted hover:text-accent transition-colors"
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
                    ? "bg-white/10 text-white"
                    : "card text-secondary hover:bg-white/5"
                }`}
              >
                <span>All Tasks</span>
                <span className="text-[10px] text-muted">{tasks.length}</span>
              </button>

              {/* Project List */}
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full px-2 py-1.5 rounded-lg text-sm flex justify-between items-center transition-all ${
                    selectedProjectId === project.id
                      ? "bg-white/10 text-white"
                      : "card text-secondary hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <span className="text-[10px] text-muted">
                    {tasks.filter((t) => t.projectId === project.id).length}
                  </span>
                </button>
              ))}

              <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 pt-2 flex items-center gap-1.5">
                <FiTag className="w-3.5 h-3.5" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1.5 px-1">
                {["Work", "Personal", "Study", "Health"].map((t) => (
                  <span
                    key={t}
                    onClick={() => setSelectedTag(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer border transition-all ${
                      selectedTag === t
                        ? "badge-success text-accent"
                        : "card text-secondary hover:bg-white/5"
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
        <div className="flex-1 card-elevated rounded-xl p-6 flex flex-col justify-between overflow-hidden">
          {/* Header & Quick Add Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/6 pb-3">
              <div>
                <h2 className="text-base font-semibold text-accent capitalize">
                  {activeCategory} Tasks
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  {filteredTasks.length} tasks scheduled
                </p>
              </div>
            </div>

            {/* Comprehensive Task Creation Form */}
            <form onSubmit={handleAddTask} className="p-3 card space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to focus on today?"
                className="w-full h-9 px-3 input rounded-lg text-sm text-primary placeholder-muted"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Priority Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted text-[10px]">Priority:</span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="input rounded px-2 py-1 text-sm text-primary"
                    >
                      <option value="high">High (Red)</option>
                      <option value="medium">Medium (Amber)</option>
                      <option value="low">Low (Green)</option>
                    </select>
                  </div>

                  {/* Sessions Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted text-[10px]">Est. Sessions:</span>
                    <select
                      value={estimatedSessions}
                      onChange={(e) => setEstimatedSessions(Number(e.target.value))}
                      className="input rounded px-2 py-1 text-sm text-primary"
                    >
                      <option value={1}>1 Session (25m)</option>
                      <option value={2}>2 Sessions (50m)</option>
                      <option value={3}>3 Sessions (75m)</option>
                      <option value={4}>4 Sessions (100m)</option>
                    </select>
                  </div>

                  {/* Project Select */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted text-[10px]">Project:</span>
                    <select
                      value={selectedProjectForTask || ""}
                      onChange={(e) => setSelectedProjectForTask(e.target.value || null)}
                      className="input rounded px-2 py-1 text-sm text-primary"
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
                    <FiRepeat className="w-3.5 h-3.5 text-muted" />
                    <select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                      className="input rounded px-2 py-1 text-sm text-primary"
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
                  <span className="text-muted text-[10px]">Repeat until:</span>
                  <input
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className="input rounded px-2 py-1 text-sm text-primary"
                  />
                </div>
              )}
            </form>

            {/* Task Rows List */}
            <div className="space-y-2 overflow-y-auto max-h-[380px] no-scrollbar pr-1">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl card">
                  <p className="text-sm text-muted">No tasks found in this section.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                      activeTaskId === task.id
                        ? "bg-accent/10 border-accent/40 text-primary"
                        : "card hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded accent-accent cursor-pointer"
                      />

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-sm font-medium truncate ${
                            task.completed ? "line-through text-muted" : "text-primary"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {/* Priority Badge */}
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.2 rounded border uppercase badge ${
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
                                className="text-[9px] font-medium px-1.5 py-0.2 rounded border badge"
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
                            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded badge text-purple-300">
                              {task.tags[0]}
                            </span>
                          )}

                          {/* Recurrence Badge */}
                          {task.recurrence && task.recurrence !== "none" && (
                            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded badge text-blue-300 flex items-center gap-1">
                              <FiRepeat className="w-2.5 h-2.5" />
                              {task.recurrence}
                            </span>
                          )}

                          <span className="text-[10px] text-muted">Due: Today</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Focus Session Counter */}
                      <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg badge text-secondary">
                        {task.completedFocusSessions}/{task.estimatedFocusSessions}
                      </span>

                      {/* Set Active Task for Timer */}
                      <button
                        onClick={() => setActiveTask(task.id)}
                        title="Set active for focus timer"
                        className={`p-1.5 rounded-lg border transition-all ${
                          activeTaskId === task.id
                            ? "btn-primary border-accent"
                            : "card text-secondary hover:text-primary hover:bg-white/5"
                        }`}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Task */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-muted hover:text-red-400 transition-colors"
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
            <div className="card-elevated p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-accent">Create Project</h3>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-secondary mb-1 block">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full h-9 px-3 input rounded-lg text-sm text-primary placeholder-muted"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary mb-1 block">Project Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newProjectColor}
                      onChange={(e) => setNewProjectColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <span className="text-xs text-muted">{newProjectColor}</span>
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