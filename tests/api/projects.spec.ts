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

test("Admin can create a new project using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const name = `API Project ${Date.now()}`;
  const key = `AP${Date.now().toString().slice(-3)}`;

  const response = await projectsApi.createProject({ name, key });

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.project).toBeDefined();
  expect(body.project.name).toBe(name);
  expect(body.project.key).toBe(key);
  expect(body.project.status).toBe("active");
  expect(body.project.id).toBeTruthy();
  expect(body.project.createdAt).toBeTruthy();
  expect(body.project.updatedAt).toBeTruthy();
});

test("Admin cannot create a project without a key", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const name = `Project Without Key ${Date.now()}`;

  const response = await projectsApi.createProject({ name });

  expect(response.status()).toBe(400);

  const body = await response.json();

  expect(body.error.code).toBe("VALIDATION_ERROR");
  expect(body.error.details[0].path).toEqual(["key"]);
  expect(body.error.details[0].message).toBe("Required");
});

test("Admin cannot create a project with a 1-character key", async ({
  request,
}) => {
  const projectsApi = new ProjectsApi(request);

  const name = `Project Short Key ${Date.now()}`;

  const response = await projectsApi.createProject({
    name,
    key: "A",
  });

  expect(response.status()).toBe(400);

  const body = await response.json();

  expect(body.error.code).toBe("VALIDATION_ERROR");
  expect(body.error.details[0].path).toEqual(["key"]);
  expect(body.error.details[0].message).toBe(
    "String must contain at least 2 character(s)",
  );
});

test("Admin cannot create a project with an existing key", async ({
  request,
}) => {
  const projectsApi = new ProjectsApi(request);

  const key = `D${Date.now().toString().slice(-3)}`;

  // Create the first project
  const firstResponse = await projectsApi.createProject({
    name: `First Project ${Date.now()}`,
    key,
  });

  expect(firstResponse.status()).toBe(201);

  // Try creating another project with the same key
  const secondResponse = await projectsApi.createProject({
    name: `Second Project ${Date.now()}`,
    key,
  });

  expect(secondResponse.status()).toBe(409);

  const body = await secondResponse.json();

  expect(body.error.code).toBe("CONFLICT");
  expect(body.error.message).toBe("Unique constraint violation");
  expect(body.error.details.target).toEqual(["key"]);
});

test("Admin can update a project using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const key = `U${Date.now().toString().slice(-3)}`;

  // Create a project first
  const createResponse = await projectsApi.createProject({
    name: `Project Before Update ${Date.now()}`,
    key,
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.project.id;

  // Update the project
  const updatedName = `Project After Update ${Date.now()}`;

  const updateResponse = await projectsApi.updateProject(projectId, {
    name: updatedName,
  });

  expect(updateResponse.status()).toBe(200);

  const body = await updateResponse.json();

  expect(body.project.id).toBe(projectId);
  expect(body.project.name).toBe(updatedName);
  expect(body.project.key).toBe(key);
  expect(body.project.status).toBe("active");
  expect(body.project.updatedAt).toBeTruthy();
});

test("Admin can delete a project using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const key = `X${Date.now().toString().slice(-3)}`;

  // Create project first
  const createResponse = await projectsApi.createProject({
    name: `Project To Delete ${Date.now()}`,
    key,
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.project.id;

  // Delete project
  const deleteResponse = await projectsApi.deleteProject(projectId);

  expect(deleteResponse.status()).toBe(204);
});

test("Deleted project is no longer returned by API search", async ({
  request,
}) => {
  const projectsApi = new ProjectsApi(request);

  const key = `Z${Date.now().toString().slice(-3)}`;
  const name = `Project Delete Verify ${Date.now()}`;

  // Create project
  const createResponse = await projectsApi.createProject({
    name,
    key,
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.project.id;

  // Delete project
  const deleteResponse = await projectsApi.deleteProject(projectId);

  expect(deleteResponse.status()).toBe(204);

  // Verify project is no longer returned
  const response = await request.get("/projects");

  expect(response.status()).toBe(200);

  const body = await response.json();

  const deletedProject = body.items?.find(
    (project: { id: string }) => project.id === projectId,
  );

  expect(deletedProject).toBeUndefined();
});

test("Admin can search projects using API", async ({ request }) => {
  const projectsApi = new ProjectsApi(request);

  const response = await request.get(
    "/projects?q=hey&page=1&pageSize=20&sort=createdAt:desc",
  );

  expect(response.status()).toBe(200);

  const projects = await response.json();

  expect(projects.page).toBe(1);
  expect(projects.pageSize).toBe(20);
  expect(projects.total).toBeGreaterThan(0);

  expect(
    projects.items.some((project: { name: string }) =>
      project.name.toLowerCase().includes("hey"),
    ),
  ).toBeTruthy();
});

test("Admin gets no results for unknown project search", async ({
  request,
}) => {
  const response = await request.get(
    "/projects?q=project-that-does-not-exist&page=1&pageSize=20&sort=createdAt:desc",
  );

  expect(response.status()).toBe(200);

  const projects = await response.json();

  expect(projects.page).toBe(1);
  expect(projects.pageSize).toBe(20);
  expect(projects.total).toBe(0);
  expect(projects.items).toHaveLength(0);
});

test("Admin can paginate projects using API", async ({ request }) => {
  const response = await request.get(
    "/projects?page=1&pageSize=2&sort=createdAt:desc",
  );

  expect(response.status()).toBe(200);

  const projects = await response.json();

  expect(Array.isArray(projects.items)).toBeTruthy();
  expect(projects.page).toBe(1);
  expect(projects.pageSize).toBe(2);
  expect(projects.total).toBeGreaterThanOrEqual(0);

  expect(projects.items.length).toBeLessThanOrEqual(2);
});

test("Admin cannot update a non-existent project", async ({ request }) => {
  const response = await request.patch(
    "/projects/00000000-0000-0000-0000-000000000000",
    {
      data: {
        name: "Non Existent Project",
      },
    },
  );

  expect(response.status()).toBe(404);

  const body = await response.json();

  expect(body.error.code).toBe("NOT_FOUND");
});

test("Admin cannot delete a non-existent project", async ({ request }) => {
  const response = await request.delete(
    "/projects/00000000-0000-0000-0000-000000000000",
  );

  expect(response.status()).toBe(404);
});
