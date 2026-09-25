import { strict as assert } from "node:assert";
import { dashboardService } from "../src/services/dashboard.service.ts";
import { projectRoutes } from "../src/routes/project.routes.ts";
import { experimentRoutes } from "../src/routes/experiment.routes.ts";
import { reagentRoutes } from "../src/routes/reagent.routes.ts";
import { reagentUsageRoutes } from "../src/routes/reagentUsage.routes.ts";
import { memberRoutes } from "../src/routes/member.routes.ts";
import { auditLogs } from "../src/prisma/seeds/seed.ts";

const pi = { id: "u-pi", name: "王教授", role: "PI" };
const query = new URLSearchParams();

const dashboard = dashboardService.summary();
assert.equal(dashboard.activeProjects.length >= 2, true);

const members = memberRoutes("GET", "/api/members", query);
assert.equal(Array.isArray(members), true);

const projects = projectRoutes("GET", "/api/projects", query, pi, {});
assert.equal(projects.length >= 3, true);

const project = projectRoutes("POST", "/api/projects", query, pi, {
  name: "烟雾测试项目",
  projectNo: "RL-SMOKE-001",
  totalBudget: 10000
});
assert.equal(project.status, "Proposal");

const experiment = experimentRoutes("POST", "/api/experiments", query, pi, {
  projectId: projects[0].id,
  title: "烟雾测试实验"
});
assert.equal(experiment.reviewStatus, "Draft");

const reagent = reagentRoutes("POST", "/api/reagents", query, pi, {
  name: "烟雾测试试剂",
  stock: 6,
  minStock: 1
});
assert.equal(reagent.name, "烟雾测试试剂");
assert.equal(reagent.frozenStock, 0);

// 草稿状态的实验不允许领取
assert.throws(
  () => reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment.id, quantity: 1 }),
  (error) => error.code === "EXPERIMENT_NOT_CLAIMABLE"
);

const submitted = experimentRoutes("PATCH", `/api/experiments/${experiment.id}/submit`, query, pi, {});
assert.equal(submitted.reviewStatus, "Submitted");

// 可用库存不足时报错，且不产生冻结
assert.throws(
  () => reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment.id, quantity: 100 }),
  (error) => error.code === "INSUFFICIENT_STOCK"
);
assert.equal(reagent.frozenStock, 0);

// 提交领用单：待审批并冻结数量，库存总量不变
const usage = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, {
  reagentId: reagent.id,
  experimentId: experiment.id,
  quantity: 1,
  purpose: "smoke usage"
});
assert.equal(usage.quantity, 1);
assert.equal(usage.status, "PendingApproval");
assert.equal(reagent.frozenStock, 1);
assert.equal(reagent.stock, 6);

// 实验通过：领用单转已领用，冻结转为实际扣减
const reviewed = experimentRoutes("PATCH", `/api/experiments/${experiment.id}/review`, query, pi, { status: "Approved", comment: "ok" });
assert.equal(reviewed.reviewStatus, "Approved");
assert.equal(usage.status, "Received");
assert.equal(reagent.frozenStock, 0);
assert.equal(reagent.stock, 5);

// 实验驳回：取消领用并释放冻结
const rejectedExperiment = experimentRoutes("POST", "/api/experiments", query, pi, { projectId: projects[0].id, title: "驳回流程实验" });
experimentRoutes("PATCH", `/api/experiments/${rejectedExperiment.id}/submit`, query, pi, {});
const rejectedUsage = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, {
  reagentId: reagent.id,
  experimentId: rejectedExperiment.id,
  quantity: 2
});
assert.equal(reagent.frozenStock, 2);
experimentRoutes("PATCH", `/api/experiments/${rejectedExperiment.id}/review`, query, pi, { status: "Rejected", comment: "数据不完整" });
assert.equal(rejectedUsage.status, "Cancelled");
assert.equal(reagent.frozenStock, 0);
assert.equal(reagent.stock, 5);

// 实验退回修改：同样取消领用并释放冻结
const revisionExperiment = experimentRoutes("POST", "/api/experiments", query, pi, { projectId: projects[0].id, title: "退回流程实验" });
experimentRoutes("PATCH", `/api/experiments/${revisionExperiment.id}/submit`, query, pi, {});
const revisionUsage = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, {
  reagentId: reagent.id,
  experimentId: revisionExperiment.id,
  quantity: 1
});
assert.equal(reagent.frozenStock, 1);
experimentRoutes("PATCH", `/api/experiments/${revisionExperiment.id}/review`, query, pi, { status: "RevisionRequired", comment: "需要补测" });
assert.equal(revisionUsage.status, "Cancelled");
assert.equal(reagent.frozenStock, 0);
assert.equal(reagent.stock, 5);

// 已通过的实验不能再发起领取
assert.throws(
  () => reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment.id, quantity: 1 }),
  (error) => error.code === "EXPERIMENT_NOT_CLAIMABLE"
);

// 领用记录按状态筛选
const receivedOnly = reagentUsageRoutes("GET", "/api/reagent-usages", new URLSearchParams("status=Received"), pi, {});
assert.equal(receivedOnly.length >= 1, true);
assert.equal(receivedOnly.every((item) => item.status === "Received"), true);
const cancelledOnly = reagentUsageRoutes("GET", "/api/reagent-usages", new URLSearchParams("status=Cancelled"), pi, {});
assert.equal(cancelledOnly.every((item) => item.status === "Cancelled"), true);

const stocked = reagentRoutes("PATCH", `/api/reagents/${reagent.id}/stock-in`, query, pi, { quantity: 2 });
assert.equal(stocked.stock, 7);
assert.equal(auditLogs.length >= 6, true);

console.log("ld-422 backend route smoke passed");
