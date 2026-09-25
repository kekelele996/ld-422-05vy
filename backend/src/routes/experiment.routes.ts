import { experimentController } from "../controllers/experiment.controller.ts";

export function experimentRoutes(method: string, path: string, query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/experiments") return experimentController.list(query);
  if (method === "POST" && path === "/api/experiments") return experimentController.create(user, body);
  if (method === "PATCH" && path.endsWith("/submit")) return experimentController.submit(user, path.split("/").at(-2) ?? "");
  if (method === "PATCH" && path.endsWith("/review")) return experimentController.review(user, path.split("/").at(-2) ?? "", String(body.status ?? "Approved"), String(body.comment ?? ""));
  return undefined;
}
