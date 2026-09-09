import { test, expect } from "@playwright/test";
import { users } from "../../config/users";

test("Admin can login using API", async ({ request }) => {
  const response = await request.post("/auth/login", {
    data: {
      email: users.admin.email,
      password: users.admin.password,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body).toEqual({
    ok: true,
  });
  const cookies = await request.storageState();

  expect(
    cookies.cookies.some((cookie) => cookie.name === "access_token"),
  ).toBeTruthy();
});

test("Admin cannot login with invalid credentials", async ({ request }) => {
  const response = await request.post("/auth/login", {
    data: {
      email: users.admin.email,
      password: "WrongPassword123",
    },
  });

  expect(response.status()).toBe(401);

  const body = await response.json();

  expect(body.error.code).toBe("AUTH_INVALID_CREDENTIALS");
  expect(body.error.message).toBe("Invalid email or password");
});
