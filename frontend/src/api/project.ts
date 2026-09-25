import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { ResearchProject } from "../types/project";

export const projectApi = {
  list: (status = "") => request<ResearchProject[]>(`${API_PATHS.projects}?status=${status}`),
  create: (payload: Partial<ResearchProject>) => request<ResearchProject>(API_PATHS.projects, { method: "POST", body: JSON.stringify(payload) }),
  detail: (id: string) => request<ResearchProject>(`${API_PATHS.projects}/${id}`)
};
