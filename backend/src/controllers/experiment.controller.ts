import type { User } from "../types/interfaces.ts";
import { experimentService } from "../services/experiment.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";
import { rbacMiddleware } from "../middlewares/rbac.middleware.ts";

export const experimentController = {
  list(query: URLSearchParams) {
    return experimentService.list(query.get("projectId") ?? "", query.get("status") ?? "");
  },
  create(user: User, body: Record<string, unknown>) {
    const record = experimentService.create(body);
    auditLogMiddleware(user, "CREATE_EXPERIMENT", "ExperimentRecord", record.id);
    return record;
  },
  submit(user: User, id: string) {
    const record = experimentService.submit(id);
    auditLogMiddleware(user, "SUBMIT_EXPERIMENT", "ExperimentRecord", record.id);
    return record;
  },
  review(user: User, id: string, status: string, comment = "") {
    rbacMiddleware(user, ["Admin", "PI", "SubPI", "Researcher"]);
    const record = experimentService.review(id, user.id, status, comment);
    auditLogMiddleware(user, "REVIEW_EXPERIMENT", "ExperimentRecord", record.id);
    return record;
  }
};
