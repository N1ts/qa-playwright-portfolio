import { test, expect } from "@playwright/test";
import { ProjectsApi } from "../../api/projects.api";

test("Admin can fetch projects using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const response = await projectsApi.getProjects();

  expect(response.status()).toBe(200);

  const projects = await response.json();

  expect(Array.isArray(projects.items)).toBeTruthy();
  expect(projects.page).toBe(1);
  expect(projects.pageSize).toBe(20);
  expect(projects.total).toBeGreaterThanOrEqual(0);
});
