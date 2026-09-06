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
