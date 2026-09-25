import type { User } from "../types/interfaces.ts";
import { projectService } from "../services/project.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";
import { rbacMiddleware } from "../middlewares/rbac.middleware.ts";

export const projectController = {
  list(query: URLSearchParams) {
    return projectService.list(query.get("status") ?? "");
  },
  detail(id: string) {
    return projectService.detail(id);
  },
  create(user: User, body: Record<string, unknown>) {
    rbacMiddleware(user, ["Admin", "PI", "SubPI"]);
    const project = projectService.create(body);
    auditLogMiddleware(user, "CREATE_PROJECT", "ResearchProject", project.id);
    return project;
  }
};
