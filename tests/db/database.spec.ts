import { test, expect } from "@playwright/test";
import { createDbClient } from "../../utils/db/database";

test("Created user exists in database", async ({ request }) => {
  const client = await createDbClient();

  const email = `db-test-${Date.now()}@example.com`;

  // Create user through API
  const response = await request.post("http://localhost:3000/users", {
    data: {
      email,
      password: "test123",
      role: "viewer",
    },
  });

  expect(response.status()).toBe(201);

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

test("Deleted user no longer exists in database", async ({ request }) => {
  const client = await createDbClient();

  const email = `db-delete-${Date.now()}@example.com`;

  // Create user through API
  const createResponse = await request.post("/users", {
    data: {
      email,
      password: "test123",
      role: "viewer",
    },
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.user.id;

  // Delete user through API
  const deleteResponse = await request.delete(`/users/${userId}`);

  expect(deleteResponse.status()).toBe(204);

  // Verify user no longer exists in database
  const result = await client.query('SELECT id FROM "User" WHERE id = $1', [
    userId,
  ]);

  expect(result.rows).toHaveLength(0);

  await client.end();
});

test("Created project exists in database", async ({ request }) => {
  const client = await createDbClient();

  const name = `DB Test Project ${Date.now()}`;
  const key = `DB${Date.now()}`;

  // Create project through API
  const response = await request.post("/projects", {
    data: {
      name,
      key,
    },
  });

  expect(response.status()).toBe(201);

  const createdProject = await response.json();
  const projectId = createdProject.project.id;

  // Verify project exists in database
  const result = await client.query(
    'SELECT id, name, key, status FROM "Project" WHERE id = $1',
    [projectId],
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].id).toBe(projectId);
  expect(result.rows[0].name).toBe(name);
  expect(result.rows[0].key).toBe(key);
  expect(result.rows[0].status).toBe("active");

  await client.end();
});

test("Deleted project no longer exists in database", async ({ request }) => {
  const client = await createDbClient();

  const name = `DB Delete Project ${Date.now()}`;
  const key = `DEL${Date.now()}`;

  // Create project through API
  const createResponse = await request.post("/projects", {
    data: {
      name,
      key,
    },
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.project.id;

  // Delete project through API
  const deleteResponse = await request.delete(`/projects/${projectId}`);

  expect(deleteResponse.status()).toBe(204);

  // Verify project no longer exists in database
  const result = await client.query('SELECT id FROM "Project" WHERE id = $1', [
    projectId,
  ]);

  expect(result.rows).toHaveLength(0);

  await client.end();
});

test("Updated user data is persisted in database", async ({ request }) => {
  const client = await createDbClient();

  const email = `db-update-${Date.now()}@example.com`;

  // Create user
  const createResponse = await request.post("/users", {
    data: {
      email,
      password: "test123",
      role: "viewer",
    },
  });

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.user.id;

  // Update user role
  const updateResponse = await request.patch(`/users/${userId}`, {
    data: {
      role: "admin",
    },
  });

  expect(updateResponse.status()).toBe(200);

  // Verify updated role in database
  const result = await client.query(
    'SELECT id, email, role FROM "User" WHERE id = $1',
    [userId],
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].email).toBe(email);
  expect(result.rows[0].role).toBe("admin");

  await client.end();
});

test("Updated project data is persisted in database", async ({ request }) => {
  const client = await createDbClient();

  const name = `DB Update Project ${Date.now()}`;
  const key = `UPD${Date.now()}`;

  // Create project
  const createResponse = await request.post("/projects", {
    data: {
      name,
      key,
    },
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.project.id;

  // Update project name
  const updatedName = `${name} Updated`;

  const updateResponse = await request.patch(`/projects/${projectId}`, {
    data: {
      name: updatedName,
    },
  });

  expect(updateResponse.status()).toBe(200);

  // Verify updated name in database
  const result = await client.query(
    'SELECT id, name, key FROM "Project" WHERE id = $1',
    [projectId],
  );

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].name).toBe(updatedName);
  expect(result.rows[0].key).toBe(key);

  await client.end();
});

test("Created user has valid generated and default database values", async ({
  request,
}) => {
  const client = await createDbClient();

  const email = `db-defaults-${Date.now()}@example.com`;

  const response = await request.post("/users", {
    data: {
      email,
      password: "test123",
      role: "viewer",
    },
  });

  expect(response.status()).toBe(201);

  const createdUser = await response.json();
  const userId = createdUser.user.id;

  const result = await client.query(
    'SELECT id, status, "createdAt", "updatedAt" FROM "User" WHERE id = $1',
    [userId],
  );

  expect(result.rows).toHaveLength(1);

  const user = result.rows[0];

  expect(user.id).toBeTruthy();
  expect(user.status).toBe("active");
  expect(user.createdAt).toBeTruthy();
  expect(user.updatedAt).toBeTruthy();

  await client.end();
});

test("Database enforces unique user email constraint", async () => {
  const client = await createDbClient();

  const email = `db-unique-${Date.now()}@example.com`;

  await client.query(
    `INSERT INTO "User"
     (id, email, "passwordHash", role, status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
    [crypto.randomUUID(), email, "test-hash", "viewer", "active"],
  );

  await expect(
    client.query(
      `INSERT INTO "User"
       (id, email, "passwordHash", role, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [crypto.randomUUID(), email, "test-hash", "viewer", "active"],
    ),
  ).rejects.toThrow();

  await client.end();
});

test("Invalid user creation is not persisted in database", async ({
  request,
}) => {
  const client = await createDbClient();

  const invalidEmail = `invalid-${Date.now()}`;

  const response = await request.post("/users", {
    data: {
      email: invalidEmail,
      password: "test123",
      role: "viewer",
    },
  });

  expect(response.status()).toBe(400);

  const result = await client.query('SELECT id FROM "User" WHERE email = $1', [
    invalidEmail,
  ]);

  expect(result.rows).toHaveLength(0);

  await client.end();
});
