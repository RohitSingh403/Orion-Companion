// src/store/taskStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Task, TaskPriority } from "../types/task";

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  estimatedFocusSessions?: number;
  dueDate?: string | null;
  projectId?: string | null;
  tags?: string[];
}

interface TaskStore {
  tasks: Task[];
  activeTaskId: string | null;

  addTask: (data: string | CreateTaskData) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  setActiveTask: (id: string | null) => void;
  incrementTaskFocusSession: (id: string) => void;
  clearCompleted: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      activeTaskId: null,

      addTask: (data) => {
        const input: CreateTaskData =
          typeof data === "string" ? { title: data } : data;

        if (!input.title.trim()) return;

        const newTask: Task = {
          id: crypto.randomUUID(),
          title: input.title.trim(),
          description: input.description || "",
          projectId: input.projectId || null,
          priority: input.priority || "medium",
          status: "todo",
          dueDate: input.dueDate || null,
          reminder: null,
          estimatedFocusSessions: input.estimatedFocusSessions || 1,
          completedFocusSessions: 0,
          tags: input.tags || [],
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  status: !task.completed ? "completed" : "todo",
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

      setActiveTask: (id) =>
        set({
          activeTaskId: id,
        }),

      incrementTaskFocusSession: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const newCompleted = task.completedFocusSessions + 1;
            const isFinished = newCompleted >= task.estimatedFocusSessions;
            return {
              ...task,
              completedFocusSessions: newCompleted,
              completed: isFinished ? true : task.completed,
              status: isFinished ? "completed" : task.status,
              completedAt: isFinished
                ? new Date().toISOString()
                : task.completedAt,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        })),
    }),
    {
      name: "focus-companion-tasks",
    }
  )
);