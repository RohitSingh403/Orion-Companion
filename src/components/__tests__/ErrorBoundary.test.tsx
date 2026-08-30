// src/components/__tests__/ErrorBoundary.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

describe("ErrorBoundary", () => {
  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Content")).toBeDefined();
  });

  it("should render error UI when there is an error", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeDefined();
    expect(screen.getByText("Try Again")).toBeDefined();
    expect(screen.getByText("Go Home")).toBeDefined();

    consoleSpy.mockRestore();
  });

  it("should display error message in development mode", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock import.meta.env.DEV
    (import.meta.env as { DEV?: boolean }).DEV = true;

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/)).toBeDefined();

    (import.meta.env as { DEV?: boolean }).DEV = false;
    consoleSpy.mockRestore();
  });
});
