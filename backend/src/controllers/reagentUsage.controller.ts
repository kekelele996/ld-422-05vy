import type { User } from "../types/interfaces.ts";
import { reagentUsageService } from "../services/reagentUsage.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";

export const reagentUsageController = {
  list(query: URLSearchParams) {
    return reagentUsageService.list(query.get("reagentId") ?? "", query.get("userId") ?? "");
  },
  create(user: User, body: Record<string, unknown>) {
    const usage = reagentUsageService.create(body, user.id);
    auditLogMiddleware(user, "CREATE_REAGENT_USAGE", "ReagentUsage", usage.id);
    return usage;
  }
};
