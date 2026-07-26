// src/types/task.ts

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus =
  | "todo"
  | "in-progress"
  | "completed";

export interface Task {
  id: string;

  title: string;

  description: string;

  projectId: string | null;

  priority: TaskPriority;

  status: TaskStatus;

  dueDate: string | null;

  reminder: string | null;

  estimatedFocusSessions: number;

  completedFocusSessions: number;

  tags: string[];

  completed: boolean;

  completedAt: string | null;

  createdAt: string;

  updatedAt: string;
}