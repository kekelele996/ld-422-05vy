import type { UserRole } from "../types/enums.ts";
import type { User } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export function rbacMiddleware(user: User, allowed: UserRole[]) {
  if (!allowed.includes(user.role)) throw new ApiError(403, "FORBIDDEN", `当前角色 ${user.role} 无权执行该操作`);
}
