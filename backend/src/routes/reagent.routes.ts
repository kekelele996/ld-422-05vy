import { reagentController } from "../controllers/reagent.controller.ts";

export function reagentRoutes(method: string, path: string, query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/reagents") return reagentController.list(query);
  if (method === "GET" && path.startsWith("/api/reagents/")) return reagentController.detail(path.split("/").at(-1) ?? "");
  if (method === "POST" && path === "/api/reagents") return reagentController.create(user, body);
  if (method === "PATCH" && path.endsWith("/stock-in")) return reagentController.stockIn(user, path.split("/").at(-2) ?? "", Number(body.quantity ?? 0));
  return undefined;
}
