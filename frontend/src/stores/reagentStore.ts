import { defineStore } from "pinia";
import { reagentApi } from "../api/reagent";
import { reagentUsageApi } from "../api/reagentUsage";
import type { Reagent, ReagentUsage } from "../types/reagent";

export const useReagentStore = defineStore("reagents", {
  state: () => ({ items: [] as Reagent[], usages: [] as ReagentUsage[] }),
  actions: {
    async load(lowOnly = false) {
      this.items = await reagentApi.list(lowOnly);
    },
    async loadUsages(reagentId = "", userId = "", status = "") {
      this.usages = await reagentUsageApi.list(reagentId, userId, status);
    },
    async createUsage(payload: Partial<ReagentUsage>) {
      await reagentUsageApi.create(payload);
    }
  }
});
