import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContributionHeatmap from "../ContributionHeatmap";

describe("ContributionHeatmap", () => {
  it("draws a single year of plain cells", () => {
    const year = new Date().getFullYear();
    const { container } = render(
      <ContributionHeatmap data={[{ date: `${year}-05-22`, count: 2 }]} />,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
    expect(screen.queryAllByRole("button", { name: /sessions on/ })).toHaveLength(0);
    expect(container.querySelector("[class*='backdrop-blur']")).toBeNull();
    const cssWidth = Number.parseFloat(canvas?.style.width || "0");
    expect(cssWidth).toBeGreaterThan(600);
    expect(cssWidth).toBeLessThan(900);
    expect(canvas?.getAttribute("aria-label")).toContain("weeks");
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((month) => {
      expect(screen.getByText(month)).toBeDefined();
    });
  });
});
