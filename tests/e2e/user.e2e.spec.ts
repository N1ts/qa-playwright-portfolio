import { test, expect } from "../../fixtures/test";
import { createDbClient } from "../../utils/db/database";

test("Admin creates user through UI and user is persisted in database", async ({
  usersPage,
}) => {
  const client = await createDbClient();

  const email = `e2e-user-${Date.now()}@example.com`;

  await usersPage.navigate();

  console.log("Current URL:", await usersPage.page.url());
  console.log("Page title:", await usersPage.page.title());
  console.log(email);
  await usersPage.page.screenshot({
    path: "e2e-debug.png",
    fullPage: true,
  });

  await usersPage.createUser(email, "test123", "viewer");

  // Verify user is visible in UI
  await expect(usersPage.getUserRow(email)).toBeVisible();

  // Verify user exists in database
  const result = await client.query(
    'SELECT email, role, status FROM "User" WHERE email = $1',
    [email],
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].email).toBe(email);
  expect(result.rows[0].role).toBe("viewer");
  expect(result.rows[0].status).toBe("active");

  await client.end();
});
