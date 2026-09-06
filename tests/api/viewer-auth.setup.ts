import { test as setup, expect } from "@playwright/test";
import { users } from "../../config/users";

const authFile = "playwright/.auth/api-viewer.json";

setup("authenticate API as viewer", async ({ request }) => {
  const response = await request.post("/auth/login", {
    data: {
      email: users.viewer.email,
      password: users.viewer.password,
    },
  });

  expect(response.status()).toBe(200);

  await request.storageState({
    path: authFile,
  });
});
