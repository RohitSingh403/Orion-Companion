import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContributionHeatmap from "../ContributionHeatmap";

describe("ContributionHeatmap", () => {
  it("draws a single year of plain cells", () => {
    const year = new Date().getFullYear();
    const { container } = render(
      <ContributionHeatmap data={[{ date: `${year}-05-22`, count: 2 }]} />,
    );

    const cells = screen.getAllByRole("button", { name: /sessions on/ });
    expect(cells.length).toBeGreaterThan(360);
    expect(cells.length).toBeLessThanOrEqual(54 * 7);
    expect(container.querySelector("[class*='backdrop-blur']")).toBeNull();
    expect(screen.getByLabelText(`2 sessions on ${year}-05-22`)).toBeDefined();
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((month) => {
      expect(screen.getByText(month)).toBeDefined();
    });
  });
});
