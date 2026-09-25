import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { ReagentUsage } from "../types/reagent";

export const reagentUsageApi = {
  list: (reagentId = "", userId = "", status = "") =>
    request<ReagentUsage[]>(`${API_PATHS.reagentUsages}?reagentId=${reagentId}&userId=${userId}&status=${status}`),
  create: (payload: Partial<ReagentUsage>) => request<ReagentUsage>(API_PATHS.reagentUsages, { method: "POST", body: JSON.stringify(payload) })
};
