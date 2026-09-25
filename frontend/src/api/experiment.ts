import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { ExperimentRecord } from "../types/experiment";

export const experimentApi = {
  list: (projectId = "", status = "") => request<ExperimentRecord[]>(`${API_PATHS.experiments}?projectId=${projectId}&status=${status}`),
  create: (payload: Partial<ExperimentRecord>) => request<ExperimentRecord>(API_PATHS.experiments, { method: "POST", body: JSON.stringify(payload) }),
  submit: (id: string) => request<ExperimentRecord>(`${API_PATHS.experiments}/${id}/submit`, { method: "PATCH" }),
  review: (id: string, status = "Approved", comment = "") => request<ExperimentRecord>(`${API_PATHS.experiments}/${id}/review`, { method: "PATCH", body: JSON.stringify({ status, comment }) })
};
