import { defineStore } from "pinia";
import { experimentApi } from "../api/experiment";
import type { ExperimentRecord } from "../types/experiment";

export const useExperimentStore = defineStore("experiments", {
  state: () => ({ items: [] as ExperimentRecord[] }),
  actions: {
    async load(projectId = "", status = "") {
      this.items = await experimentApi.list(projectId, status);
    }
  }
});
