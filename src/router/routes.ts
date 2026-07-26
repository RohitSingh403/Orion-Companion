// src/router/routes.ts

export const routes = {
  dashboard: "/",
  focus: "/focus",
  tasks: "/tasks",
  notes: "/notes",
  analytics: "/analytics",
  achievements: "/achievements",
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof routes;