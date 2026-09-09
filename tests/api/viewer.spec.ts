import { test, expect } from "@playwright/test";
import { ProjectsApi } from "../../api/projects.api";
import { UsersApi } from "../../api/users.api";

test("Viewer can fetch users using API", async ({ request }) => {
  const response = await request.get("/users");

  expect(response.status()).toBe(200);

  const users = await response.json();

  expect(Array.isArray(users.items)).toBeTruthy();
  expect(users.page).toBe(1);
  expect(users.pageSize).toBe(20);
  expect(users.total).toBeGreaterThanOrEqual(0);
});

test("Viewer cannot create a new user using API", async ({ request }) => {
  const response = await request.post("/users", {
    data: {
      email: `viewer_test_${Date.now()}@example.com`,
      password: "Test@12345",
      role: "viewer",
    },
  });

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body.error.code).toBe("FORBIDDEN");
  expect(body.error.message).toBe("Forbidden");
});

test("Viewer cannot create a project using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const response = await projectsApi.createProject({
    name: `Viewer Project ${Date.now()}`,
    key: `V${Date.now().toString().slice(-3)}`,
  });

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body.error.code).toBe("FORBIDDEN");
  expect(body.error.message).toBe("Forbidden");
});

test("Viewer cannot update a project using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const projectsResponse = await request.get("/projects");

  expect(projectsResponse.status()).toBe(200);

  const projects = await projectsResponse.json();

  expect(projects.items.length).toBeGreaterThan(0);

  const projectId = projects.items[0].id;

  const response = await projectsApi.updateProject(projectId, {
    name: "Viewer Updated Project",
  });

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body.error.code).toBe("FORBIDDEN");
  expect(body.error.message).toBe("Forbidden");
});

test("Viewer cannot delete a project using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const projectsResponse = await request.get("/projects");

  expect(projectsResponse.status()).toBe(200);

  const projects = await projectsResponse.json();

  expect(projects.items.length).toBeGreaterThan(0);

  const projectId = projects.items[0].id;

  const response = await projectsApi.deleteProject(projectId);

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body.error.code).toBe("FORBIDDEN");
  expect(body.error.message).toBe("Forbidden");
});

test("Viewer cannot update a user using API", async ({ request }) => {
  const usersApi = new UsersApi(request);

  const usersResponse = await request.get("/users");

  expect(usersResponse.status()).toBe(200);

  const users = await usersResponse.json();

  expect(users.items.length).toBeGreaterThan(0);

  const userId = users.items[0].id;

  const response = await usersApi.updateUser(userId, {
    role: "admin",
  });

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body.error.code).toBe("FORBIDDEN");
  expect(body.error.message).toBe("Forbidden");
});

test("Viewer cannot delete a user using API", async ({ request }) => {
  const usersApi = new UsersApi(request);

  const usersResponse = await request.get("/users");

  expect(usersResponse.status()).toBe(200);

  const users = await usersResponse.json();

  expect(users.items.length).toBeGreaterThan(0);

  const userId = users.items[0].id;

  const response = await usersApi.deleteUser(userId);

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body.error.code).toBe("FORBIDDEN");
  expect(body.error.message).toBe("Forbidden");
});
