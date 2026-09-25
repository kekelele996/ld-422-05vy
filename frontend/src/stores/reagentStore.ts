import { defineStore } from "pinia";
import { reagentApi } from "../api/reagent";
import { reagentUsageApi } from "../api/reagentUsage";
import type { Reagent, ReagentUsage } from "../types/reagent";

export type UsageFilters = { reagentId: string; userId: string; status: string };

export const useReagentStore = defineStore("reagents", {
  state: () => ({
    items: [] as Reagent[],
    usages: [] as ReagentUsage[],
    usageFilters: { reagentId: "", userId: "", status: "" } as UsageFilters
  }),
  actions: {
    async load(lowOnly = false) {
      this.items = await reagentApi.list(lowOnly);
    },
    async loadUsages(filters?: UsageFilters) {
      const next = filters ?? this.usageFilters;
      this.usageFilters = { ...next };
      this.usages = await reagentUsageApi.list(next.reagentId, next.userId, next.status);
    },
    async createUsage(payload: Partial<ReagentUsage>) {
      const usage = await reagentUsageApi.create(payload);
      // 领用会冻结库存，试剂与领用列表一起刷新
      await Promise.all([this.load(), this.loadUsages()]);
      return usage;
    }
  }
});
