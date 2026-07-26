// src/store/taskStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Task } from "../types/task";

interface TaskStore {
  tasks: Task[];

  addTask: (
    title: string,
    description?: string
  ) => void;

  deleteTask: (id: string) => void;

  toggleTask: (id: string) => void;

  updateTask: (
    id: string,
    data: Partial<Task>
  ) => void;

  clearCompleted: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (title, description = "") =>
        set((state) => ({
          tasks: [
            {
              id: crypto.randomUUID(),

              title,

              description,

              projectId: null,

              priority: "medium",

              status: "todo",

              dueDate: null,

              reminder: null,

              estimatedFocusSessions: 1,

              completedFocusSessions: 0,

              tags: [],

              completed: false,

              completedAt: null,

              createdAt: new Date().toISOString(),

              updatedAt: new Date().toISOString(),
            },

            ...state.tasks,
          ],
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => task.id !== id
          ),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  status: !task.completed
                    ? "completed"
                    : "todo",
                  completedAt: !task.completed
                    ? new Date().toISOString()
                    : null,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => !task.completed
          ),
        })),
    }),
    {
      name: "focus-companion-tasks",
    }
  )
);