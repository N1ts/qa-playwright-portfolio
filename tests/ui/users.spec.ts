import { test, expect } from "../../fixtures/test";

test("Admin can create a new user", async ({ usersPage }) => {
  await usersPage.navigate();

  const email = `testuser_${Date.now()}@example.com`;

  await usersPage.createUser(email, "Test@12345", "admin");

  await expect(usersPage.getUserRow(email)).toBeVisible();
});

test("Admin cannot create a user without an email", async ({ usersPage }) => {
  await usersPage.navigate();

  await usersPage.createUser("", "Test@12345", "viewer");

  await expect(usersPage.validationError).toHaveText(
    "VALIDATION_ERROR: Validation error",
  );
});

test("Admin can search users", async ({ usersPage }) => {
  await usersPage.navigate();

  await usersPage.searchInput.fill("admin@example.com");

  await expect(usersPage.getUserRow("admin@example.com")).toBeVisible();
});

test("Search returns no result for unknown user", async ({ usersPage }) => {
  await usersPage.navigate();

  await usersPage.searchInput.fill("DoesNotExist");

  await expect(usersPage.getUserRow("DoesNotExist")).toHaveCount(0);
});
