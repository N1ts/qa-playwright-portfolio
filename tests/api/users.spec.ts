import { test, expect } from "@playwright/test";
import { UsersApi } from "../../api/users.api";

test("Admin can fetch users using API", async ({ request }) => {
  const usersApi = new UsersApi(request);

  const response = await usersApi.getUsers();

  expect(response.status()).toBe(200);

  const users = await response.json();

  expect(Array.isArray(users.items)).toBeTruthy();
  expect(users.page).toBe(1);
  expect(users.pageSize).toBe(20);
  expect(users.total).toBeGreaterThanOrEqual(0);
});

test("Admin can create a new user using API", async ({ request }) => {
  const usersApi = new UsersApi(request);

  const email = `api_user_${Date.now()}@example.com`;

  const response = await usersApi.createUser(email, "Test@12345", "viewer");

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.user.email).toBe(email);
  expect(body.user.role).toBe("viewer");
  expect(body.user.status).toBe("active");
  expect(body.user.id).toBeTruthy();
});

test("Admin cannot create a user with an invalid email", async ({
  request,
}) => {
  const usersApi = new UsersApi(request);

  const response = await usersApi.createUser("", "Test@12345", "viewer");

  expect(response.status()).toBe(400);

  const body = await response.json();

  expect(body.error.code).toBe("VALIDATION_ERROR");
  expect(body.error.message).toBe("Validation error");
  expect(body.error.details[0].validation).toBe("email");
  expect(body.error.details[0].code).toBe("invalid_string");
  expect(body.error.details[0].message).toBe("Invalid email");
});

test("Admin cannot create a user with a password shorter than 6 characters", async ({
  request,
}) => {
  const usersApi = new UsersApi(request);

  const response = await usersApi.createUser(
    "test@example.com",
    "12345",
    "viewer",
  );

  expect(response.status()).toBe(400);

  const body = await response.json();

  expect(body.error.code).toBe("VALIDATION_ERROR");
  expect(body.error.message).toBe("Validation error");
  expect(body.error.details[0].code).toBe("too_small");
  expect(body.error.details[0].minimum).toBe(6);
  expect(body.error.details[0].path[0]).toBe("password");
});

test("Admin can create a user with a password of exactly 6 characters", async ({
  request,
}) => {
  const usersApi = new UsersApi(request);

  const email = `boundary_${Date.now()}@example.com`;

  const response = await usersApi.createUser(email, "123456", "viewer");

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.user.email).toBe(email);
  expect(body.user.role).toBe("viewer");
  expect(body.user.status).toBe("active");
  expect(body.user.id).toBeTruthy();
});

test("Admin cannot create a user with an existing email", async ({
  request,
}) => {
  const usersApi = new UsersApi(request);

  const response = await usersApi.createUser(
    "admin@example.com",
    "Test@12345",
    "viewer",
  );

  expect(response.status()).toBe(409);

  const body = await response.json();

  expect(body.error.code).toBe("CONFLICT");
  expect(body.error.message).toBe("Unique constraint violation");
  expect(body.error.details.modelName).toBe("User");
  expect(body.error.details.target).toContain("email");
});

test("Admin can update a user using API", async ({ request }) => {
  const usersApi = new UsersApi(request);

  // Create a test user
  const email = `update_${Date.now()}@example.com`;

  const createResponse = await usersApi.createUser(
    email,
    "Test@12345",
    "viewer",
  );

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.user.id;

  // Update the user
  const updateResponse = await usersApi.updateUser(userId, {
    role: "admin",
  });

  expect(updateResponse.status()).toBe(200);

  const body = await updateResponse.json();

  expect(body.user.id).toBe(userId);
  expect(body.user.email).toBe(email);
  expect(body.user.role).toBe("admin");
  expect(body.user.status).toBe("active");
});

test("Admin can delete a user using API", async ({ request }) => {
  const usersApi = new UsersApi(request);

  // Create a test user
  const email = `delete_${Date.now()}@example.com`;

  const createResponse = await usersApi.createUser(
    email,
    "Test@12345",
    "viewer",
  );

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.user.id;

  // Delete the user
  const deleteResponse = await usersApi.deleteUser(userId);

  expect(deleteResponse.status()).toBe(204);
});

test("Deleted user is no longer returned by API search", async ({
  request,
}) => {
  const usersApi = new UsersApi(request);

  // Create a test user
  const email = `delete_verify_${Date.now()}@example.com`;

  const createResponse = await usersApi.createUser(
    email,
    "Test@12345",
    "viewer",
  );

  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.user.id;

  // Delete the user
  const deleteResponse = await usersApi.deleteUser(userId);

  expect(deleteResponse.status()).toBe(204);

  // Verify the user no longer exists
  const searchResponse = await request.get("/users", {
    params: {
      q: email,
      page: 1,
      pageSize: 20,
    },
  });

  expect(searchResponse.status()).toBe(200);

  const users = await searchResponse.json();

  expect(users.total).toBe(0);
  expect(users.items).toHaveLength(0);
});
