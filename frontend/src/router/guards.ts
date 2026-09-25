import type { UserRole } from "../types/enums";

export function canVisit(role: UserRole, path: string) {
  if (role === "Student" && path.includes("review")) return false;
  return true;
}
