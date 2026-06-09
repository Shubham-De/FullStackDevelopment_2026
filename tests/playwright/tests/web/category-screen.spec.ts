import { expect, test } from "./fixtures";

test.describe("CATEGORY SCREEN", () => {
  test.beforeAll(async () => {
    await fetch("http://localhost:3001/api/seed");
  });

  test(
    "Existing Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/react");
      //await page.waitForLoadState("domcontentloaded");

      //const content = await page.content();
      //console.log("PAGE CONTENT LENGTH:", content.length);
      //console.log("HAS BLOG POST:", content.includes("blog-post-"));

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(2);

      await expect(page.getByTestId("blog-post-2")).toBeVisible();
      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Invalid Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/abc");

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});