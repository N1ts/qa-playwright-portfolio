import { test, expect, request as playwrightRequest } from "@playwright/test";
import { users } from "../../config/users";
import { UsersApi } from "../../api/users.api";

test("Admin creates user through API and verifies user in UI", async ({
  page,
}) => {
  const apiContext = await playwrightRequest.newContext({
    baseURL: "http://localhost:3000",
  });

  // Authenticate API context
  const loginResponse = await apiContext.post("/auth/login", {
    data: {
      email: users.admin.email,
      password: users.admin.password,
    },
  });

  expect(loginResponse.status()).toBe(200);

  const usersApi = new UsersApi(apiContext);

  const email = `api-e2e-user-${Date.now()}@example.com`;

  const response = await usersApi.createUser(email, "test123", "viewer");

  expect(response.status()).toBe(201);

  // Verify through UI
  await page.goto("/users");

  await expect(page.getByText(email, { exact: true })).toBeVisible();

  await apiContext.dispose();
});
