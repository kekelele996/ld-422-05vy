import { memberController } from "../controllers/member.controller.ts";

export function memberRoutes(method: string, path: string, query: URLSearchParams) {
  if (method === "GET" && path === "/api/members") return memberController.list(query);
  return undefined;
}
