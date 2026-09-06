import { APIRequestContext } from "@playwright/test";

export class ProjectsApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProjects() {
    return await this.request.get("/projects");
  }
}
