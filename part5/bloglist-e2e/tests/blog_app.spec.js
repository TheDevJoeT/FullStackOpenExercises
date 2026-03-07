const { test, expect, describe, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
  });

  test("user can log in", async ({ page }) => {
    await loginWith(page, "mluukkai", "salainen");
    await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  });

  test("login fails with wrong password", async ({ page }) => {
    await loginWith(page, "mluukkai", "wrong");

    await expect(page.getByText("wrong username or password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "logout" }),
    ).not.toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      const title = `blog-${Date.now()}`;

      await createBlog(page, title, "Test Author", "http://test.com");

      await expect(
        page.locator(".blog").filter({ hasText: title }),
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      const title = `like-blog-${Date.now()}`;

      await createBlog(page, title, "Author", "http://test.com");

      const blog = page.locator(".blog").filter({ hasText: title });

      await blog.getByRole("button", { name: "view" }).click();
      await blog.getByRole("button", { name: "like" }).click();

      await expect(blog).toContainText("likes 1");
    });

    test("blog can be deleted by the creator", async ({ page }) => {
      const title = `delete-blog-${Date.now()}`;

      await createBlog(page, title, "author", "http://a.com");

      const blog = page.locator(".blog").filter({ hasText: title });

      await blog.getByRole("button", { name: "view" }).click();

      page.once("dialog", (dialog) => dialog.accept());

      await blog.getByRole("button", { name: "remove" }).click();

      await expect(
        page.locator(".blog").filter({ hasText: title }),
      ).toHaveCount(0);
    });

    test("only the creator sees the delete button", async ({
      page,
      request,
    }) => {
      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Other User",
          username: "other",
          password: "secret",
        },
      });

      const title = `creator-blog-${Date.now()}`;

      await createBlog(page, title, "author", "http://a.com");

      await page.getByRole("button", { name: "logout" }).click();

      await loginWith(page, "other", "secret");

      const blog = page.locator(".blog").filter({ hasText: title });

      await blog.getByRole("button", { name: "view" }).click();

      await expect(blog.getByRole("button", { name: "remove" })).toHaveCount(0);
    });

    test("blogs are ordered according to likes", async ({ page }) => {
      const first = `order-first-${Date.now()}`;
      const second = `order-second-${Date.now()}`;
      const third = `order-third-${Date.now()}`;

      await createBlog(page, first, "A", "http://a.com");
      await createBlog(page, second, "B", "http://b.com");
      await createBlog(page, third, "C", "http://c.com");

      const secondBlog = page.locator(".blog").filter({ hasText: second });
      await secondBlog.getByRole("button", { name: "view" }).click();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await secondBlog.getByRole("button", { name: "like" }).click();

      const thirdBlog = page.locator(".blog").filter({ hasText: third });
      await thirdBlog.getByRole("button", { name: "view" }).click();
      await thirdBlog.getByRole("button", { name: "like" }).click();

      await page.waitForTimeout(500);

      const blogs = page.locator(".blog");

      const texts = await blogs.allTextContents();

      const filtered = texts.filter(
        (t) => t.includes(first) || t.includes(second) || t.includes(third),
      );

      expect(filtered[0]).toContain(second);
      expect(filtered[1]).toContain(third);
      expect(filtered[2]).toContain(first);
    });
  });
});
