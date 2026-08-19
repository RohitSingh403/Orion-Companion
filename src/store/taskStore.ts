// src/store/taskStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Task, TaskPriority, RecurrenceType, Subtask } from "../types/task";

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  estimatedFocusSessions?: number;
  dueDate?: string | null;
  projectId?: string | null;
  tags?: string[];
  recurrence?: RecurrenceType;
  recurrenceEndDate?: string | null;
  subtasks?: Subtask[];
  parentTaskId?: string | null;
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
  generateRecurringTasks: () => void;
  
  // Subtask management
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, title: string) => void;
  
  // Time tracking
  addTimeSpent: (taskId: string, minutes: number) => void;
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
          recurrence: input.recurrence || "none",
          recurrenceEndDate: input.recurrenceEndDate || null,
          subtasks: input.subtasks || [],
          timeSpent: 0,
          parentTaskId: input.parentTaskId || null,
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

      generateRecurringTasks: () =>
        set((state) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const newTasks: Task[] = [];
          
          state.tasks.forEach((task) => {
            if (!task.dueDate || task.recurrence === "none") return;
            
            const dueDate = new Date(task.dueDate);
            const recurrenceEndDate = task.recurrenceEndDate 
              ? new Date(task.recurrenceEndDate) 
              : null;
            
            // Only generate if the due date is in the past or today
            if (dueDate > today) return;
            
            // Check if we've passed the recurrence end date
            if (recurrenceEndDate && today > recurrenceEndDate) return;
            
            let nextDueDate = new Date(dueDate);
            
            // Calculate next due date based on recurrence type
            switch (task.recurrence) {
              case "daily":
                nextDueDate.setDate(nextDueDate.getDate() + 1);
                break;
              case "weekly":
                nextDueDate.setDate(nextDueDate.getDate() + 7);
                break;
              case "monthly":
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
              case "yearly":
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                break;
            }
            
            // Check if next due date is within recurrence end date
            if (recurrenceEndDate && nextDueDate > recurrenceEndDate) return;
            
            // Create new recurring task
            const recurringTask: Task = {
              ...task,
              id: crypto.randomUUID(),
              dueDate: nextDueDate.toISOString(),
              completedFocusSessions: 0,
              completed: false,
              status: "todo",
              completedAt: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            newTasks.push(recurringTask);
          });
          
          return {
            tasks: [...state.tasks, ...newTasks],
          };
        }),

      // Subtask management
      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: [
                    ...(task.subtasks || []),
                    {
                      id: crypto.randomUUID(),
                      title,
                      completed: false,
                      completedAt: null,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks?.map((subtask) =>
                    subtask.id === subtaskId
                      ? {
                          ...subtask,
                          completed: !subtask.completed,
                          completedAt: !subtask.completed
                            ? new Date().toISOString()
                            : null,
                        }
                      : subtask
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks?.filter((s) => s.id !== subtaskId),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      updateSubtask: (taskId, subtaskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks?.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, title }
                      : subtask
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      // Time tracking
      addTimeSpent: (taskId, minutes) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  timeSpent: (task.timeSpent || 0) + minutes,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),
    }),
    {
      name: "focus-companion-tasks",
    }
  )
);