import { test, expect } from "../../fixtures/test";

test("Admin can create a new project", async ({ projectsPage }) => {
  await projectsPage.navigate();

  const name = `Test Project ${Date.now()}`;
  const key = `TP-${Date.now()}`;

  await projectsPage.createProject(name, key);

  await expect(projectsPage.getProjectRow(name)).toBeVisible();
});

test("Admin cannot create a project without a name", async ({
  projectsPage,
}) => {
  await projectsPage.navigate();

  await projectsPage.createProject("", "TP-12345");

  await expect(projectsPage.validationError).toHaveText(
    "VALIDATION_ERROR: Validation error",
  );
});

test("Admin can search projects", async ({ projectsPage }) => {
  await projectsPage.navigate();

  await projectsPage.searchInput.fill("Alpha");

  await expect(projectsPage.getProjectRow("Alpha")).toBeVisible();
});

test("Search returns no result for unknown project", async ({
  projectsPage,
}) => {
  await projectsPage.navigate();

  await projectsPage.searchInput.fill("DoesNotExist");

  await expect(projectsPage.getProjectRow("DoesNotExist")).toHaveCount(0);
});
