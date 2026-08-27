// e2e/focus-timer.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Focus Timer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to Focus page", async ({ page }) => {
    await page.click('text=Focus');
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
    await expect(page.locator('button:has-text("Resume")')).toBeVisible();
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
    await page.goto("/");
    
    // Navigate to Tasks
    await page.click('text=Workspace');
    await expect(page).toHaveURL("/tasks");
    
    // Navigate to Calendar
    await page.click('text=Calendar');
    await expect(page).toHaveURL("/calendar");
    
    // Navigate to Notes
    await page.click('text=Notes');
    await expect(page).toHaveURL("/notes");
    
    // Navigate back to Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL("/");
  });
});

test.describe("Dashboard", () => {
  test("should display dashboard elements", async ({ page }) => {
    await page.goto("/");
    
    // Check for key dashboard elements
    await expect(page.locator("text=Today's Goal")).toBeVisible();
    await expect(page.locator("text=Focus Score")).toBeVisible();
    await expect(page.locator("text=Current Streak")).toBeVisible();
  });
});
