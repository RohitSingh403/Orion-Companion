// src/types/project.ts

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}