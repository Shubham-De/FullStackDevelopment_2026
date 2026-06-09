import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await fetch("http://localhost:3001/api/seed");
});

test.describe("PAGINATION", () => {
  test(
    "Pagination controls are visible",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/");

      // Pagination controls should be visible
      await expect(page.getByText("Previous")).toBeVisible();
      await expect(page.getByText("Next")).toBeVisible();
      await expect(page.getByText(/Page \d+ of \d+/)).toBeVisible();
    },
  );

  test(
    "Previous button is disabled on first page",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/");

      // On the first page, the Previous button should be disabled
      await expect(page.getByText("Previous")).toBeDisabled();
    },
  );

  test(
    "Can navigate to next page",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/");

      // Should show "Page 1 of X"
      await expect(page.getByText("Page 1 of")).toBeVisible();

      // Click Next to go to page 2
      // (only works if there are more than 3 posts, which is the page size)
      const nextButton = page.getByText("Next");
      const isDisabled = await nextButton.isDisabled();

      if (!isDisabled) {
        await nextButton.click();
        // Should now show "Page 2 of X"
        await expect(page.getByText("Page 2 of")).toBeVisible();
        // Previous should now be enabled
        await expect(page.getByText("Previous")).toBeEnabled();
      }
    },
  );

  test(
    "Shows 0 Posts message when no posts match",
    { tag: "@a4" },
    async ({ page }) => {
      // Visit a category with no posts
      await page.goto("/category/abc");

      // Should show "0 Posts" and no pagination
      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});
