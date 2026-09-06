import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/api-admin.json";
import { users } from "../../config/users";

setup("authenticate API as admin", async ({ request }) => {
  const response = await request.post("/auth/login", {
    data: {
      email: users.admin.email,
      password: users.admin.password,
    },
  });

  expect(response.status()).toBe(200);

  await request.storageState({
    path: authFile,
  });
});
