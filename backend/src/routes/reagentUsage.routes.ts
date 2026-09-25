import { reagentUsageController } from "../controllers/reagentUsage.controller.ts";

export function reagentUsageRoutes(method: string, path: string, query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/reagent-usages") return reagentUsageController.list(query);
  if (method === "POST" && path === "/api/reagent-usages") return reagentUsageController.create(user, body);
  return undefined;
}
