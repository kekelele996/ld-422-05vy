import { reagentUsages, reagents } from "../prisma/seeds/seed.ts";
import type { ReagentUsage } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const reagentUsageService = {
  list(reagentId = "", userId = "") {
    return reagentUsages.filter((item) => (!reagentId || item.reagentId === reagentId) && (!userId || item.userId === userId));
  },
  create(input: Partial<ReagentUsage>, approverId: string) {
    if (!input.reagentId || !input.experimentId) throw new ApiError(400, "USAGE_INVALID", "试剂和实验记录必填");
    const reagent = reagents.find((item) => item.id === input.reagentId);
    if (!reagent) throw new ApiError(404, "REAGENT_NOT_FOUND", "试剂不存在");
    const quantity = Number(input.quantity ?? 0);
    if (quantity <= 0) throw new ApiError(400, "QUANTITY_INVALID", "领用数量必须大于 0");
    if (reagent.stock < quantity) throw new ApiError(409, "INSUFFICIENT_STOCK", "库存不足");
    reagent.stock -= quantity;
    const usage: ReagentUsage = {
      id: `use-${Date.now()}`,
      reagentId: input.reagentId,
      userId: input.userId ?? "u-student",
      quantity,
      usedAt: input.usedAt ?? new Date().toISOString().slice(0, 10),
      experimentId: input.experimentId,
      purpose: input.purpose ?? "实验消耗",
      approverId
    };
    reagentUsages.unshift(usage);
    return usage;
  }
};
