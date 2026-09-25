import type { User } from "../types/interfaces.ts";
import { reagentService } from "../services/reagent.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";
import { rbacMiddleware } from "../middlewares/rbac.middleware.ts";

export const reagentController = {
  list(query: URLSearchParams) {
    return reagentService.list(query.get("lowOnly") === "true");
  },
  detail(id: string) {
    return reagentService.detail(id);
  },
  create(user: User, body: Record<string, unknown>) {
    rbacMiddleware(user, ["Admin", "PI", "SubPI", "Researcher"]);
    const reagent = reagentService.create(body);
    auditLogMiddleware(user, "CREATE_REAGENT", "Reagent", reagent.id);
    return reagent;
  },
  stockIn(user: User, id: string, quantity: number) {
    rbacMiddleware(user, ["Admin", "PI", "SubPI", "Researcher"]);
    const reagent = reagentService.stockIn(id, quantity);
    auditLogMiddleware(user, "STOCK_IN_REAGENT", "Reagent", reagent.id);
    return reagent;
  }
};
