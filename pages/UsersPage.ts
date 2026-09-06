import { Page, Locator } from "@playwright/test";

export class UsersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly createUserEmailInput: Locator;
  readonly createUserPasswordInput: Locator;
  readonly createUserRole: Locator;
  readonly createUserButton: Locator;
  readonly usersTable: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByTestId("users-search");
    this.createUserEmailInput = page.getByTestId("create-user-email");
    this.createUserPasswordInput = page.getByTestId("create-user-password");
    this.createUserRole = page.getByTestId("create-user-role");
    this.createUserButton = page.getByTestId("create-user-button");
    this.usersTable = page.getByTestId("users-table");
    this.validationError = page.locator("div.error");
  }

  async navigate() {
    await this.page.goto("/users");
  }

  async createUser(email: string, password: string, role: string) {
    await this.createUserEmailInput.fill(email);
    await this.createUserPasswordInput.fill(password);
    await this.createUserRole.selectOption(role);
    await this.createUserButton.click();
  }

  getUserRow(email: string) {
    return this.usersTable.locator("tbody tr").filter({ hasText: email });
  }
}
