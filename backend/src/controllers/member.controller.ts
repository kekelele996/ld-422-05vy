import { memberService } from "../services/member.service.ts";

export const memberController = {
  list(query: URLSearchParams) {
    return memberService.list(query.get("projectId") ?? "");
  }
};
