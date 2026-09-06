import { APIRequestContext } from "@playwright/test";

export class UsersApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getUsers() {
    return await this.request.get("/users");
  }

  async createUser(email: string, password: string, role: string) {
    return await this.request.post("/users", {
      data: {
        email,
        password,
        role,
      },
    });
  }
}
