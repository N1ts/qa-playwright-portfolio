import { Page, Locator } from "@playwright/test";

export class ProjectsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly createProjectNameInput: Locator;
  readonly createProjectKeyInput: Locator;
  readonly createProjectButton: Locator;
  readonly projectsTable: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByTestId("projects-search");
    this.createProjectNameInput = page.getByTestId("create-project-name");
    this.createProjectKeyInput = page.getByTestId("create-project-key");
    this.createProjectButton = page.getByTestId("create-project-button");
    this.projectsTable = page.getByTestId("projects-table");
    this.validationError = page.locator("div.error");
  }

  async navigate() {
    await this.page.goto("/projects");
  }

  async createProject(name: string, key: string) {
    await this.createProjectNameInput.fill(name);
    await this.createProjectKeyInput.fill(key);
    await this.createProjectButton.click();
  }

  getProjectRow(name: string) {
    return this.projectsTable.locator("tbody tr").filter({ hasText: name });
  }
}
