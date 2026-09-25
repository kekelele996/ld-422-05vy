import { experiments } from "../prisma/seeds/seed.ts";
import { ReviewStatus, type ReviewStatusValue } from "../types/enums.ts";
import type { ExperimentRecord } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";
import { reagentUsageService } from "./reagentUsage.service.ts";

export const experimentService = {
  list(projectId = "", status = "") {
    return experiments.filter((item) => (!projectId || item.projectId === projectId) && (!status || item.reviewStatus === status));
  },
  create(input: Partial<ExperimentRecord>) {
    if (!input.projectId) throw new ApiError(400, "PROJECT_REQUIRED", "必须关联研究项目");
    const record: ExperimentRecord = {
      id: `ex-${Date.now()}`,
      projectId: input.projectId,
      title: input.title ?? "未命名实验记录",
      purpose: input.purpose ?? "补充实验目的",
      method: input.method ?? "待填写",
      stepsJson: input.stepsJson ?? { type: "doc", content: [] },
      conclusion: input.conclusion ?? "",
      experimentDate: input.experimentDate ?? new Date().toISOString().slice(0, 10),
      experimenterId: input.experimenterId ?? "u-researcher",
      reviewStatus: ReviewStatus.Draft,
      attachmentUrls: input.attachmentUrls ?? []
    };
    experiments.unshift(record);
    return record;
  },
  submit(id: string) {
    const record = experiments.find((item) => item.id === id);
    if (!record) throw new ApiError(404, "EXPERIMENT_NOT_FOUND", "实验记录不存在");
    record.reviewStatus = ReviewStatus.Submitted;
    return record;
  },
  review(id: string, reviewerId: string, status: string, comment = "") {
    const record = experiments.find((item) => item.id === id);
    if (!record) throw new ApiError(404, "EXPERIMENT_NOT_FOUND", "实验记录不存在");
    record.reviewerId = reviewerId;
    record.reviewStatus = status as never;
    record.reviewComment = comment;
    // 审核结果与领用单、库存在同一流程内更新：通过→领用单转已领用且冻结转实扣；驳回/退回→取消领用并释放冻结
    reagentUsageService.syncWithReview(record.id, status as ReviewStatusValue);
    return record;
  }
};
