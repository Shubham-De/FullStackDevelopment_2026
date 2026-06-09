import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await fetch("http://localhost:3001/api/seed");
});

test.describe("COMMENT SYSTEM", () => {
  test(
    "Comment section is visible on detail page",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // The comment section should be visible
      await expect(page.getByText("Comments (0)")).toBeVisible();

      // The comment form should be visible
      await expect(page.getByPlaceholder("Your name")).toBeVisible();
      await expect(page.getByPlaceholder("Write a comment...")).toBeVisible();
      await expect(page.getByText("Post Comment")).toBeVisible();
    },
  );

  test(
    "User can add a comment",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // Fill in the comment form
      await page.getByPlaceholder("Your name").fill("John");
      await page.getByPlaceholder("Write a comment...").fill("Great post!");
      await page.getByText("Post Comment").click();

      // The comment should appear on the page
      await expect(page.getByText("John")).toBeVisible();
      await expect(page.getByText("Great post!")).toBeVisible();

      // Comment count should update
      await expect(page.getByText("Comments (1)")).toBeVisible();
    },
  );

  test(
    "User can reply to a comment",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // First add a comment
      await page.getByPlaceholder("Your name").fill("Alice");
      await page.getByPlaceholder("Write a comment...").fill("Nice article!");
      await page.getByText("Post Comment").click();
      await expect(page.getByText("Nice article!")).toBeVisible();

      // Click "Reply" on the comment
      await page.getByText("Reply").first().click();

      // Fill in the reply form
      await page.getByPlaceholder("Your name").nth(1).fill("Bob");
      await page.getByPlaceholder("Write a reply...").fill("I agree!");
      await page.getByRole("button", { name: "Reply", exact: true }).click();

      // The reply should appear
      await expect(page.getByText("Bob")).toBeVisible();
      await expect(page.getByText("I agree!")).toBeVisible();
    },
  );

  test(
    "Comment form shows error when fields are empty",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // Click Post Comment without filling anything
      await page.getByText("Post Comment").click();

      // Should show an error message
      await expect(page.getByText("Please enter your name")).toBeVisible();
    },
  );
});
