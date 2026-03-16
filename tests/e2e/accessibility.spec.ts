import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/en", "/ru"];

test("home pages have no serious accessibility violations", async ({ page }) => {
  for (const path of paths) {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const seriousViolations = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(seriousViolations, JSON.stringify(seriousViolations, null, 2)).toEqual([]);
  }
});
