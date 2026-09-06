import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { UsersPage } from "../pages/UsersPage";
import { ProjectsPage } from "../pages/ProjectsPage";

type TestFixtures = {
  loginPage: LoginPage;
  usersPage: UsersPage;
  projectsPage: ProjectsPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);
    await use(usersPage);
  },
  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page);
    await use(projectsPage);
  },
});

export { expect };
