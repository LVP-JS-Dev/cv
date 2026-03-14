import { test, expect } from "@playwright/test";

test("redirects / to /en and renders English", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("renders Russian locale", async ({ page }) => {
  await page.goto("/ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
