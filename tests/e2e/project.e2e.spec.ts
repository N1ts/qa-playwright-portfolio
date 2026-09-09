import { test, expect } from "../../fixtures/test";
import { createDbClient } from "../../utils/db/database";

test("Admin creates project through UI and project is persisted in database", async ({
  projectsPage,
}) => {
  const client = await createDbClient();

  const name = `E2E Project ${Date.now()}`;
  const key = `E2E-${Date.now()}`;

  await projectsPage.navigate();

  await projectsPage.createProject(name, key);

  // Verify project is visible in UI
  await expect(projectsPage.getProjectRow(name)).toBeVisible();

  // Verify project exists in database
  const result = await client.query(
    'SELECT name, key, status FROM "Project" WHERE name = $1',
    [name],
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].name).toBe(name);
  expect(result.rows[0].key).toBe(key);
  expect(result.rows[0].status).toBe("active");

  await client.end();
});
