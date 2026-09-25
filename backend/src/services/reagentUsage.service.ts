import { experiments, reagentUsages, reagents } from "../prisma/seeds/seed.ts";
import { ReviewStatus, UsageStatus, type ReviewStatusValue } from "../types/enums.ts";
import type { ReagentUsage } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const reagentUsageService = {
  list(reagentId = "", userId = "", status = "") {
    return reagentUsages.filter(
      (item) => (!reagentId || item.reagentId === reagentId) && (!userId || item.userId === userId) && (!status || item.status === status)
    );
  },
  create(input: Partial<ReagentUsage>, approverId: string) {
    if (!input.reagentId || !input.experimentId) throw new ApiError(400, "USAGE_INVALID", "试剂和实验记录必填");
    const reagent = reagents.find((item) => item.id === input.reagentId);
    if (!reagent) throw new ApiError(404, "REAGENT_NOT_FOUND", "试剂不存在");
    const experiment = experiments.find((item) => item.id === input.experimentId);
    if (!experiment) throw new ApiError(404, "EXPERIMENT_NOT_FOUND", "实验记录不存在");
    const claimable = experiment.reviewStatus === ReviewStatus.Submitted || experiment.reviewStatus === ReviewStatus.RevisionRequired;
    if (!claimable) throw new ApiError(409, "EXPERIMENT_STATUS_INVALID", "仅已提交或要求修改的实验才能领取试剂");
    const quantity = Number(input.quantity ?? 0);
    if (quantity <= 0) throw new ApiError(400, "QUANTITY_INVALID", "领用数量必须大于 0");
    const available = reagent.stock - reagent.frozenStock;
    if (available < quantity) throw new ApiError(409, "INSUFFICIENT_STOCK", `可用库存不足：当前可用 ${available}${reagent.unit}，冻结 ${reagent.frozenStock}${reagent.unit}`);
    // 库存与领用状态一起更新：先冻结库存，再登记待审批领用单
    reagent.frozenStock += quantity;
    const usage: ReagentUsage = {
      id: `use-${Date.now()}`,
      reagentId: input.reagentId,
      userId: input.userId ?? "u-student",
      quantity,
      usedAt: input.usedAt ?? new Date().toISOString().slice(0, 10),
      experimentId: input.experimentId,
      purpose: input.purpose ?? "实验消耗",
      approverId,
      status: UsageStatus.PendingApproval
    };
    reagentUsages.unshift(usage);
    return usage;
  },
  syncWithReview(experimentId: string, reviewStatus: ReviewStatusValue) {
    // 实验审核结果在同一步骤内驱动领用单状态与库存：通过则冻结转实扣，驳回/退回则取消并释放冻结
    const pendings = reagentUsages.filter((item) => item.experimentId === experimentId && item.status === UsageStatus.PendingApproval);
    for (const usage of pendings) {
      const reagent = reagents.find((item) => item.id === usage.reagentId);
      if (!reagent) continue;
      if (reviewStatus === ReviewStatus.Approved) {
        reagent.frozenStock -= usage.quantity;
        reagent.stock -= usage.quantity;
        usage.status = UsageStatus.Received;
      } else if (reviewStatus === ReviewStatus.Rejected || reviewStatus === ReviewStatus.RevisionRequired) {
        reagent.frozenStock -= usage.quantity;
        usage.status = UsageStatus.Cancelled;
      }
    }
    return pendings;
  }
};
