// src/store/__tests__/taskStore.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTaskStore } from "../taskStore";

describe("taskStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTaskStore.setState({
      tasks: [],
      activeTaskId: null,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useTaskStore());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.activeTaskId).toBeNull();
  });

  it("should add a task with string", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Test Task");
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("should add a task with data object", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask({
        title: "Test Task",
        priority: "high",
        estimatedFocusSessions: 3,
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Test Task");
    expect(result.current.tasks[0].priority).toBe("high");
    expect(result.current.tasks[0].estimatedFocusSessions).toBe(3);
  });

  it("should delete a task", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("should toggle task completion", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(true);
    expect(result.current.tasks[0].status).toBe("completed");
  });

  it("should set active task", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.setActiveTask(taskId);
    });

    expect(result.current.activeTaskId).toBe(taskId);
  });

  it("should clear active task when deleted", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.setActiveTask(taskId);
    });

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.activeTaskId).toBeNull();
  });

  it("should update task", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { title: "Updated Task" });
    });

    expect(result.current.tasks[0].title).toBe("Updated Task");
  });

  it("should increment task focus session", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.incrementTaskFocusSession(taskId);
    });

    expect(result.current.tasks[0].completedFocusSessions).toBe(1);
  });

  it("should add subtask", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0]?.id;

    act(() => {
      result.current.addSubtask(taskId!, "Subtask 1");
    });

    const task = result.current.tasks[0];
    expect(task?.subtasks).toBeDefined();
    expect(task?.subtasks?.[0]?.title).toBe("Subtask 1");
  });

  it("should toggle subtask", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0]?.id;

    act(() => {
      result.current.addSubtask(taskId!, "Subtask 1");
    });

    const subtaskId = result.current.tasks[0]?.subtasks?.[0]?.id;

    act(() => {
      result.current.toggleSubtask(taskId!, subtaskId!);
    });

    const updatedTask = result.current.tasks[0];
    expect(updatedTask?.subtasks?.[0]?.completed).toBe(true);
  });

  it("should delete subtask", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0]?.id;

    act(() => {
      result.current.addSubtask(taskId!, "Subtask 1");
    });

    const subtaskId = result.current.tasks[0]?.subtasks?.[0]?.id;

    act(() => {
      result.current.deleteSubtask(taskId!, subtaskId!);
    });

    const updatedTask = result.current.tasks[0];
    expect(updatedTask?.subtasks?.length).toBe(0);
  });

  it("should add time spent", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask("Test Task");
    });

    const taskId = result.current.tasks[0]?.id;

    act(() => {
      result.current.addTimeSpent(taskId!, 30);
    });

    expect(result.current.tasks[0]?.timeSpent).toBe(30);
  });
});
