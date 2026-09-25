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

// 草稿状态的实验禁止领用
assert.throws(
  () => reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment.id, quantity: 1 }),
  /才能领取/
);

const submitted = experimentRoutes("PATCH", `/api/experiments/${experiment.id}/submit`, query, pi, {});
assert.equal(submitted.reviewStatus, "Submitted");

// 已提交实验可领用：提交领用单后冻结库存，不直接扣减
const usage = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, {
  reagentId: reagent.id,
  experimentId: experiment.id,
  quantity: 1,
  purpose: "smoke usage"
});
assert.equal(usage.quantity, 1);
assert.equal(usage.status, "PendingApproval");
let detail = reagentRoutes("GET", `/api/reagents/${reagent.id}`, query, pi, {});
assert.equal(detail.frozenStock, 1);
assert.equal(detail.stock, 6);
assert.equal(detail.availableStock, 5);

// 可用库存不足时报错
assert.throws(
  () => reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment.id, quantity: 99 }),
  /可用库存不足/
);

// 审核通过：领用单转已领用，冻结转实扣
const reviewed = experimentRoutes("PATCH", `/api/experiments/${experiment.id}/review`, query, pi, { status: "Approved", comment: "ok" });
assert.equal(reviewed.reviewStatus, "Approved");
detail = reagentRoutes("GET", `/api/reagents/${reagent.id}`, query, pi, {});
assert.equal(detail.frozenStock, 0);
assert.equal(detail.stock, 5);
const received = reagentUsageRoutes("GET", "/api/reagent-usages", new URLSearchParams("status=Received"), pi, {});
assert.equal(received.some((item) => item.id === usage.id), true);

// 驳回：取消待审批领用单并释放冻结
const experiment2 = experimentRoutes("POST", "/api/experiments", query, pi, { projectId: projects[0].id, title: "驳回流程实验" });
experimentRoutes("PATCH", `/api/experiments/${experiment2.id}/submit`, query, pi, {});
const usage2 = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment2.id, quantity: 2 });
assert.equal(usage2.status, "PendingApproval");
detail = reagentRoutes("GET", `/api/reagents/${reagent.id}`, query, pi, {});
assert.equal(detail.frozenStock, 2);
experimentRoutes("PATCH", `/api/experiments/${experiment2.id}/review`, query, pi, { status: "Rejected", comment: "方案不可行" });
detail = reagentRoutes("GET", `/api/reagents/${reagent.id}`, query, pi, {});
assert.equal(detail.frozenStock, 0);
assert.equal(detail.stock, 5);
const cancelled = reagentUsageRoutes("GET", "/api/reagent-usages", new URLSearchParams("status=Cancelled"), pi, {});
assert.equal(cancelled.some((item) => item.id === usage2.id), true);

// 要求修改：同样取消领用并释放冻结，且修改中的实验可重新领用
const experiment3 = experimentRoutes("POST", "/api/experiments", query, pi, { projectId: projects[0].id, title: "退回修改流程实验" });
experimentRoutes("PATCH", `/api/experiments/${experiment3.id}/submit`, query, pi, {});
const usage3 = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment3.id, quantity: 1 });
experimentRoutes("PATCH", `/api/experiments/${experiment3.id}/review`, query, pi, { status: "RevisionRequired", comment: "补充对照组" });
const cancelled3 = reagentUsageRoutes("GET", "/api/reagent-usages", new URLSearchParams("status=Cancelled"), pi, {});
assert.equal(cancelled3.some((item) => item.id === usage3.id), true);
const usage4 = reagentUsageRoutes("POST", "/api/reagent-usages", query, pi, { reagentId: reagent.id, experimentId: experiment3.id, quantity: 1 });
assert.equal(usage4.status, "PendingApproval");

const stocked = reagentRoutes("PATCH", `/api/reagents/${reagent.id}/stock-in`, query, pi, { quantity: 2 });
assert.equal(stocked.stock, 7);
assert.equal(auditLogs.length >= 6, true);

console.log("ld-422 backend route smoke passed");
