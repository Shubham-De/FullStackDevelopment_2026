import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("RICH TEXT EDITOR", () => {
  //test.beforeEach(async () => {
    //await seed();
  //});

  test(
    "Rich Editor toggle button is visible on edit page",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.goto("http://localhost:3002/post/no-front-end-framework-is-the-best");
      await expect(userPage.getByText("Rich Editor")).toBeVisible();
    },
  );

  test(
    "Can switch to rich editor mode",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.goto("http://localhost:3002/post/no-front-end-framework-is-the-best");
      await expect(userPage.getByLabel("Content")).toBeVisible();
      await userPage.getByText("Rich Editor").click();
      await expect(userPage.getByText("Plain Editor")).toBeVisible();
      await expect(userPage.locator(".w-md-editor")).toBeVisible();
    },
  );

  test(
    "Can switch back to plain editor",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.goto("http://localhost:3002/post/no-front-end-framework-is-the-best");
      await userPage.getByText("Rich Editor").click();
      await expect(userPage.getByText("Plain Editor")).toBeVisible();
      await userPage.getByText("Plain Editor").click();
      await expect(userPage.getByLabel("Content")).toBeVisible();
      await expect(userPage.getByText("Rich Editor")).toBeVisible();
    },
  );

  test(
    "Content is preserved when switching editors",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.goto("http://localhost:3002/post/no-front-end-framework-is-the-best");
      await userPage.getByLabel("Content").fill("Hello World");
      await userPage.getByText("Rich Editor").click();
      await userPage.getByText("Plain Editor").click();
      await expect(userPage.getByLabel("Content")).toHaveValue("Hello World");
    },
  );
});