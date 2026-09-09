import { test, expect } from "../../fixtures/test";
import { createDbClient } from "../../utils/db/database";

test("Admin updates user through UI and database reflects the change", async ({
  usersPage,
}) => {
  const client = await createDbClient();

  const email = `e2e-update-${Date.now()}@example.com`;

  await usersPage.navigate();

  // Create user through UI
  await usersPage.createUser(email, "test123", "viewer");

  await expect(usersPage.getUserRow(email)).toBeVisible();

  // Get user ID from database
  const userResult = await client.query(
    'SELECT id FROM "User" WHERE email = $1',
    [email],
  );

  expect(userResult.rows).toHaveLength(1);

  const userId = userResult.rows[0].id;

  // Update the user through UI
  // We'll need to see whether your current UsersPage exposes
  // the edit functionality before writing this part.

  await client.end();
});
