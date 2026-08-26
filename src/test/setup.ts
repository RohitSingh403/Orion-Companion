// src/test/setup.ts

import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.focusAPI for Electron APIs
global.window = Object.create(window);
Object.defineProperty(window, "focusAPI", {
  value: {
    getAutoLaunchStatus: vi.fn(),
    toggleAutoLaunch: vi.fn(),
  },
  writable: true,
});

// Mock import.meta.env.DEV
Object.defineProperty(import.meta, "env", {
  value: {
    DEV: false,
  },
  writable: true,
});
