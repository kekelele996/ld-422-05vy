import { experiments, reagentUsages, reagents } from "../prisma/seeds/seed.ts";
import { ReviewStatus, UsageStatus } from "../types/enums.ts";
import type { ReviewStatusValue } from "../types/enums.ts";
import type { ReagentUsage } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

// 仅已提交或要求修改的实验允许领取试剂
const CLAIMABLE_STATUSES: ReviewStatusValue[] = [ReviewStatus.Submitted, ReviewStatus.RevisionRequired];

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
    if (!CLAIMABLE_STATUSES.includes(experiment.reviewStatus)) {
      throw new ApiError(409, "EXPERIMENT_NOT_CLAIMABLE", "仅已提交或要求修改的实验才能领取试剂");
    }
    const quantity = Number(input.quantity ?? 0);
    if (quantity <= 0) throw new ApiError(400, "QUANTITY_INVALID", "领用数量必须大于 0");
    if (reagent.stock - reagent.frozenStock < quantity) throw new ApiError(409, "INSUFFICIENT_STOCK", "可用库存不足");
    // 领用单提交后进入待审批，冻结对应数量（可用 = stock - frozenStock）
    reagent.frozenStock += quantity;
    const usage: ReagentUsage = {
      id: `use-${Date.now()}-${reagentUsages.length}`,
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
  // 实验审核联动结算：通过则冻结转实扣（已领用），驳回或退回则取消领用并释放冻结
  settleByExperiment(experimentId: string, reviewStatus: ReviewStatusValue) {
    const settled: ReagentUsage[] = [];
    const terminal = reviewStatus === ReviewStatus.Approved || reviewStatus === ReviewStatus.Rejected || reviewStatus === ReviewStatus.RevisionRequired;
    if (!terminal) return settled;
    for (const usage of reagentUsages) {
      if (usage.experimentId !== experimentId || usage.status !== UsageStatus.PendingApproval) continue;
      const reagent = reagents.find((item) => item.id === usage.reagentId);
      if (!reagent) continue;
      reagent.frozenStock = Math.max(0, reagent.frozenStock - usage.quantity);
      if (reviewStatus === ReviewStatus.Approved) {
        reagent.stock = Math.max(0, reagent.stock - usage.quantity);
        usage.status = UsageStatus.Received;
      } else {
        usage.status = UsageStatus.Cancelled;
      }
      settled.push(usage);
    }
    return settled;
  }
};
