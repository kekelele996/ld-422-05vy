import { reagentUsages, reagents } from "../prisma/seeds/seed.ts";
import { HazardLevel, StorageCondition } from "../types/enums.ts";
import type { Reagent } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const reagentService = {
  list(lowOnly = false) {
    return lowOnly ? reagents.filter((item) => item.stock < item.minStock) : reagents;
  },
  detail(id: string) {
    const reagent = reagents.find((item) => item.id === id);
    if (!reagent) throw new ApiError(404, "REAGENT_NOT_FOUND", "试剂不存在");
    return { ...reagent, usageHistory: reagentUsages.filter((usage) => usage.reagentId === id) };
  },
  create(input: Partial<Reagent>) {
    const reagent: Reagent = {
      id: `rg-${Date.now()}`,
      name: input.name ?? "新试剂",
      casNo: input.casNo ?? "N/A",
      formula: input.formula ?? "N/A",
      purity: input.purity ?? "分析纯",
      hazardLevel: input.hazardLevel ?? HazardLevel.Safe,
      storageCondition: input.storageCondition ?? StorageCondition.RoomTemp,
      supplier: input.supplier ?? "待补充",
      stock: Number(input.stock ?? 0),
      unit: input.unit ?? "瓶",
      minStock: Number(input.minStock ?? 1),
      location: input.location ?? "未分配"
    };
    reagents.unshift(reagent);
    return reagent;
  },
  stockIn(id: string, quantity: number) {
    const reagent = reagents.find((item) => item.id === id);
    if (!reagent) throw new ApiError(404, "REAGENT_NOT_FOUND", "试剂不存在");
    reagent.stock += quantity;
    return reagent;
  }
};
