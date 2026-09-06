import { test as setup, expect } from "@playwright/test";
import { users } from "../config/users";

const authFile = "playwright/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("login-email").fill(users.admin.email);
  await page.getByTestId("login-password").fill(users.admin.password);
  await page.getByTestId("login-submit").click();

  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({ path: authFile });
});
