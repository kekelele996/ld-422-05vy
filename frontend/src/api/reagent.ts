import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { Reagent } from "../types/reagent";

export const reagentApi = {
  list: (lowOnly = false) => request<Reagent[]>(`${API_PATHS.reagents}?lowOnly=${lowOnly}`),
  create: (payload: Partial<Reagent>) => request<Reagent>(API_PATHS.reagents, { method: "POST", body: JSON.stringify(payload) }),
  stockIn: (id: string, quantity: number) => request<Reagent>(`${API_PATHS.reagents}/${id}/stock-in`, { method: "PATCH", body: JSON.stringify({ quantity }) })
};
