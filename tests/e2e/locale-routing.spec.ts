import { expect, test } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const parsedBaseUrl = new URL(baseURL);

test.describe("root redirect", () => {
  test.use({ locale: "ru-RU" });

  test("redirects root to preferred locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ru\/?$/);
  });
});

test("cookie locale overrides accept-language", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "Next-Locale",
      value: "ru",
      domain: parsedBaseUrl.hostname,
      path: "/",
    },
  ]);
  await page.setExtraHTTPHeaders({ "accept-language": "en" });
  await page.goto("/");
  await expect(page).toHaveURL(/\/ru\/?$/);
});

test("renders correct lang and alternates for EN", async ({ page }) => {
  await page.goto("/en");
  await page.waitForFunction(() => document.documentElement.lang === "en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.locator('link[rel="alternate"][hreflang="ru"]'),
  ).toHaveAttribute("href", /\/ru$/);
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute("href", /\/en$/);
});

test("renders correct lang and alternates for RU", async ({ page }) => {
  await page.goto("/ru");
  await page.waitForFunction(() => document.documentElement.lang === "ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(
    page.locator('link[rel="alternate"][hreflang="ru"]'),
  ).toHaveAttribute("href", /\/ru$/);
});

test("project detail renders and links back", async ({ page }) => {
  await page.goto("/en/projects/biometric-kyc-liveness");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Confidential client", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to projects" })).toHaveAttribute(
    "href",
    "/en#projects",
  );
});

test("locale switcher preserves current path", async ({ page }) => {
  await page.goto("/en/projects/biometric-kyc-liveness");

  await page.getByRole("link", { name: "RU" }).click();
  await expect(page).toHaveURL(/\/ru\/projects\/biometric-kyc-liveness$/);
});

test("contact form returns fallback status when email not configured", async ({
  page,
}) => {
  await page.goto("/en#contact");

  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Message").fill("Hello from Playwright.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toHaveText(
    /Thanks! I'll reply within 1–2 days.|Email delivery is not configured. Use the mail link below./,
  );
});
