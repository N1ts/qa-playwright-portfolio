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
