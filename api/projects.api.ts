import { APIRequestContext } from "@playwright/test";

export class ProjectsApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProjects() {
    return await this.request.get("/projects");
  }

  async createProject(data: { name?: string; key?: string }) {
    return await this.request.post("/projects", {
      data,
    });
  }

  async updateProject(id: string, data: { name?: string; key?: string }) {
    return await this.request.patch(`/projects/${id}`, {
      data,
    });
  }

  async deleteProject(id: string) {
    return await this.request.delete(`/projects/${id}`);
  }
}
