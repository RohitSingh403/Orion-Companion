import path from "node:path";
import { describe, expect, it } from "vitest";
import { isAllowedNavigation } from "./navigation";

const root = path.resolve("/tmp/orion-dist");

describe("isAllowedNavigation", () => {
  it("allows the app files and the dev server only", () => {
    expect(isAllowedNavigation(`file://${root}/index.html`, root)).toBe(true);
    expect(isAllowedNavigation("http://localhost:5173/app", root, "http://localhost:5173")).toBe(true);
  });

  it("blocks other files, other sites, and script URLs", () => {
    expect(isAllowedNavigation("file:///etc/passwd", root)).toBe(false);
    expect(isAllowedNavigation(`file://${root}/../../etc/passwd`, root)).toBe(false);
    expect(isAllowedNavigation("https://example.com", root, "http://localhost:5173")).toBe(false);
    expect(isAllowedNavigation("javascript:alert(1)", root, "http://localhost:5173")).toBe(false);
    expect(isAllowedNavigation("http://localhost:5173/app", root)).toBe(false);
  });
});
