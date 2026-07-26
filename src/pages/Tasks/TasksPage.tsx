// src/pages/Tasks/TasksPage.tsx

import { useState } from "react";

import PageLayout from "../../layouts/PageLayout";
import { useTaskStore } from "../../store/taskStore";

export default function TasksPage() {
  const [title, setTitle] = useState("");

  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
  } = useTaskStore();

  const handleAddTask = () => {
    if (!title.trim()) return;

    addTask(title);
    setTitle("");
  };

  return (
    <PageLayout
      title="✅ Workspace"
      subtitle="Manage your daily tasks and focus sessions."
    >
      {/* Add Task */}

      <div className="mb-8 flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
          placeholder="What do you want to focus on today?"
          className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-0"
        />

        <button
          onClick={handleAddTask}
          className="rounded-xl bg-emerald-500 px-6 font-semibold transition hover:bg-emerald-600"
        >
          Add
        </button>
      </div>

      {/* Empty State */}

      {tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-700 py-20 text-center">
          <h2 className="text-2xl font-semibold">
            No Tasks Yet
          </h2>

          <p className="mt-3 text-zinc-400">
            Add your first task to start today's work.
          </p>
        </div>
      )}

      {/* Task List */}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-xl bg-zinc-900 p-4"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-5 w-5"
              />

              <div>
                <h3
                  className={
                    task.completed
                      ? "line-through text-zinc-500"
                      : "font-medium"
                  }
                >
                  {task.title}
                </h3>

                <p className="text-sm text-zinc-500">
                  {task.completedFocusSessions}/
                  {task.estimatedFocusSessions} Focus Sessions
                </p>
              </div>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-400 transition hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}