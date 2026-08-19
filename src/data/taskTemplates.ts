// src/data/taskTemplates.ts

import type { CreateTaskData } from "../store/taskStore";

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  tasks: CreateTaskData[];
}

export const taskTemplates: TaskTemplate[] = [
  {
    id: "daily-routine",
    name: "Daily Routine",
    description: "Common daily productivity tasks",
    tasks: [
      {
        title: "Morning Planning",
        description: "Review and plan the day's tasks",
        priority: "high",
        estimatedFocusSessions: 1,
        tags: ["planning", "morning"],
      },
      {
        title: "Deep Work Session",
        description: "Focus on most important task",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["deep-work", "important"],
      },
      {
        title: "Email & Communication",
        description: "Process emails and messages",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["communication"],
      },
      {
        title: "Review & Reflect",
        description: "Review progress and plan tomorrow",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["planning", "review"],
      },
    ],
  },
  {
    id: "project-kickoff",
    name: "Project Kickoff",
    description: "Tasks for starting a new project",
    tasks: [
      {
        title: "Define Project Goals",
        description: "Clear objectives and success criteria",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["planning", "project"],
      },
      {
        title: "Research & Planning",
        description: "Gather requirements and plan approach",
        priority: "high",
        estimatedFocusSessions: 3,
        tags: ["research", "planning"],
      },
      {
        title: "Create Task Breakdown",
        description: "Break down project into smaller tasks",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["planning", "tasks"],
      },
      {
        title: "Set Up Environment",
        description: "Configure development environment",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["setup"],
      },
      {
        title: "Initial Meeting",
        description: "Kickoff meeting with stakeholders",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["meeting", "communication"],
      },
    ],
  },
  {
    id: "software-development",
    name: "Software Development",
    description: "Common software development tasks",
    tasks: [
      {
        title: "Code Review",
        description: "Review pull requests and code changes",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["development", "review"],
      },
      {
        title: "Bug Fixes",
        description: "Address reported bugs and issues",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["development", "bugfix"],
      },
      {
        title: "Feature Development",
        description: "Implement new features",
        priority: "high",
        estimatedFocusSessions: 3,
        tags: ["development", "feature"],
      },
      {
        title: "Testing",
        description: "Write and run tests",
        priority: "medium",
        estimatedFocusSessions: 2,
        tags: ["development", "testing"],
      },
      {
        title: "Documentation",
        description: "Update project documentation",
        priority: "low",
        estimatedFocusSessions: 1,
        tags: ["documentation"],
      },
    ],
  },
  {
    id: "content-creation",
    name: "Content Creation",
    description: "Tasks for content creators",
    tasks: [
      {
        title: "Research",
        description: "Research topic and gather information",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["research", "content"],
      },
      {
        title: "Outline",
        description: "Create content outline and structure",
        priority: "high",
        estimatedFocusSessions: 1,
        tags: ["planning", "content"],
      },
      {
        title: "Draft Content",
        description: "Write first draft",
        priority: "high",
        estimatedFocusSessions: 3,
        tags: ["writing", "content"],
      },
      {
        title: "Edit & Refine",
        description: "Review and improve content",
        priority: "medium",
        estimatedFocusSessions: 2,
        tags: ["editing", "content"],
      },
      {
        title: "Publish & Promote",
        description: "Publish and share content",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["marketing", "content"],
      },
    ],
  },
  {
    id: "learning-skill",
    name: "Learning New Skill",
    description: "Tasks for learning and skill development",
    tasks: [
      {
        title: "Set Learning Goals",
        description: "Define what you want to learn",
        priority: "high",
        estimatedFocusSessions: 1,
        tags: ["learning", "planning"],
      },
      {
        title: "Find Resources",
        description: "Gather learning materials and resources",
        priority: "high",
        estimatedFocusSessions: 1,
        tags: ["research", "learning"],
      },
      {
        title: "Study Session",
        description: "Focused study time",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["learning", "study"],
      },
      {
        title: "Practice",
        description: "Apply what you've learned",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["learning", "practice"],
      },
      {
        title: "Review Notes",
        description: "Review and consolidate learning",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["learning", "review"],
      },
    ],
  },
  {
    id: "weekly-review",
    name: "Weekly Review",
    description: "Weekly productivity review tasks",
    tasks: [
      {
        title: "Review Completed Tasks",
        description: "Review what was accomplished this week",
        priority: "high",
        estimatedFocusSessions: 1,
        tags: ["review", "weekly"],
      },
      {
        title: "Analyze Productivity",
        description: "Review focus time and productivity metrics",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["analytics", "review"],
      },
      {
        title: "Plan Next Week",
        description: "Set goals and tasks for next week",
        priority: "high",
        estimatedFocusSessions: 2,
        tags: ["planning", "weekly"],
      },
      {
        title: "Clear Backlog",
        description: "Review and organize task backlog",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["planning", "cleanup"],
      },
      {
        title: "Update Projects",
        description: "Review progress on ongoing projects",
        priority: "medium",
        estimatedFocusSessions: 1,
        tags: ["project", "review"],
      },
    ],
  },
];
