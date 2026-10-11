// e2e/focus-timer.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Focus Timer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");
  });

  test("should navigate to Focus page", async ({ page }) => {
    await page.getByRole("link", { name: "Focus", exact: true }).click();
    await expect(page).toHaveURL("/focus");
    await expect(page.locator("text=Focus Mode")).toBeVisible();
  });

  test("should start focus timer", async ({ page }) => {
    await page.goto("/focus");
    
    // Click start button
    await page.click('button:has-text("Start")');
    
    // Verify timer is running
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
  });

  test("should pause focus timer", async ({ page }) => {
    await page.goto("/focus");
    
    // Start timer
    await page.click('button:has-text("Start")');
    
    // Pause timer
    await page.click('button:has-text("Pause")');
    
    // Verify timer is paused
    await expect(page.locator('button:has-text("Start")')).toBeVisible();
  });

  test("should reset focus timer", async ({ page }) => {
    await page.goto("/focus");
    
    // Start timer
    await page.click('button:has-text("Start")');
    
    // Reset timer
    await page.click('button:has-text("Reset")');
    
    // Verify timer is reset
    await expect(page.locator('button:has-text("Start")')).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/app");
    
    // Navigate to Tasks
    await page.getByRole("link", { name: "Workspace", exact: true }).click();
    await expect(page).toHaveURL("/tasks");

    await page.getByRole("link", { name: "Calendar", exact: true }).click();
    await expect(page).toHaveURL("/calendar");

    await page.getByRole("link", { name: "Notes", exact: true }).click();
    await expect(page).toHaveURL("/notes");

    await page.getByRole("link", { name: "Dashboard", exact: true }).click();
    await expect(page).toHaveURL("/app");
  });
});

test.describe("Dashboard", () => {
  test("should display dashboard elements", async ({ page }) => {
    await page.goto("/app");

    await expect(page.getByRole("heading", { name: "Work Hours" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Percent of Target" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Focus Percent" })).toBeVisible();
  });
});

test.describe("Site", () => {
  test("should introduce Orion Companion and open the app", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Your work, your focus, on your computer." })).toBeVisible();
    await page.getByRole("link", { name: "Open companion" }).click();
    await expect(page).toHaveURL("/app");
    await expect(page.getByRole("heading", { name: "Work Hours" })).toBeVisible();
  });
});
