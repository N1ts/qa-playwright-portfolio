import { test, expect } from "@playwright/test";

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
