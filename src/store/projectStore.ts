// src/store/projectStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Project, CreateProjectData } from "../types/project";

interface ProjectStore {
  projects: Project[];

  addProject: (data: CreateProjectData) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (data) => {
        if (!data.name.trim()) return;

        const newProject: Project = {
          id: crypto.randomUUID(),
          name: data.name.trim(),
          description: data.description || "",
          color: data.color || "#6366f1",
          icon: data.icon,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        })),

      getProject: (id) => {
        return get().projects.find((project) => project.id === id);
      },
    }),
    {
      name: "focus-companion-projects",
    }
  )
);
