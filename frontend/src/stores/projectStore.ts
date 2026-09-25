import { defineStore } from "pinia";
import { projectApi } from "../api/project";
import type { ResearchProject } from "../types/project";

export const useProjectStore = defineStore("projects", {
  state: () => ({ items: [] as ResearchProject[] }),
  actions: {
    async load(status = "") {
      this.items = await projectApi.list(status);
    }
  }
});
