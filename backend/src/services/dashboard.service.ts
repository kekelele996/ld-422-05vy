import { experiments, projects, reagents } from "../prisma/seeds/seed.ts";
import { ReviewStatus } from "../types/enums.ts";

export const dashboardService = {
  summary() {
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    return {
      activeProjects: projects.filter((project) => project.status === "Active"),
      recentExperimentCount: experiments.filter((record) => new Date(record.experimentDate).getTime() >= sevenDaysAgo).length,
      lowStockReagents: reagents.filter((reagent) => reagent.stock < reagent.minStock),
      pendingReviews: experiments.filter((record) => record.reviewStatus === ReviewStatus.Submitted).length
    };
  }
};
