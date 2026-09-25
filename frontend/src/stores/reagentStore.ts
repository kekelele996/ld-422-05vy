import { defineStore } from "pinia";
import { reagentApi } from "../api/reagent";
import type { Reagent } from "../types/reagent";

export const useReagentStore = defineStore("reagents", {
  state: () => ({ items: [] as Reagent[] }),
  actions: {
    async load(lowOnly = false) {
      this.items = await reagentApi.list(lowOnly);
    }
  }
});
