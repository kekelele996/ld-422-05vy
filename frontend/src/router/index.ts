import Dashboard from "../pages/Dashboard.vue";
import ProjectManage from "../pages/ProjectManage.vue";
import ExperimentRecords from "../pages/ExperimentRecords.vue";
import ReagentManage from "../pages/ReagentManage.vue";
import ReagentUsages from "../pages/ReagentUsages.vue";

export const routes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/projects", component: ProjectManage },
  { path: "/experiments", component: ExperimentRecords },
  { path: "/reagents", component: ReagentManage },
  { path: "/reagent-usages", component: ReagentUsages }
];
