import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { ProjectMember } from "../types/member";

export const memberApi = {
  list: (projectId = "") => request<ProjectMember[]>(`${API_PATHS.members}?projectId=${projectId}`)
};
