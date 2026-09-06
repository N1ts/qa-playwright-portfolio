import { test, expect } from "../../fixtures/test";

test("Admin user can login successfully", async ({ loginPage, page }) => {
  await loginPage.navigate();
  await loginPage.login("admin@example.com", "admin123");

  await expect(page).not.toHaveURL(/\/login/);
});
