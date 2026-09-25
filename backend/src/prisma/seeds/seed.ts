import { HazardLevel, ProjectStatus, ReviewStatus, StorageCondition } from "../../types/enums.ts";
import type { AuditLog, ExperimentRecord, ProjectMember, Reagent, ReagentUsage, ResearchProject, User } from "../../types/interfaces.ts";

export const users: User[] = [
  { id: "u-admin", name: "平台管理员", role: "Admin" },
  { id: "u-pi", name: "王教授", role: "PI" },
  { id: "u-researcher", name: "李博士", role: "Researcher" },
  { id: "u-student", name: "赵同学", role: "Student" }
];

export const projects: ResearchProject[] = [
  { id: "pr-immune", name: "肿瘤免疫微环境标志物研究", projectNo: "RL-2026-BIO-001", leaderId: "u-pi", direction: "Biology", startedAt: "2026-01-15", expectedEndAt: "2027-12-31", status: ProjectStatus.Active, totalBudget: 880000, usedBudget: 315000 },
  { id: "pr-catalyst", name: "低温催化材料筛选", projectNo: "RL-2025-MAT-018", leaderId: "u-pi", direction: "Materials", startedAt: "2025-09-01", expectedEndAt: "2026-11-30", status: ProjectStatus.Active, totalBudget: 520000, usedBudget: 472000 },
  { id: "pr-ai-lab", name: "实验数据智能质控平台", projectNo: "RL-2026-CS-006", leaderId: "u-researcher", direction: "CS", startedAt: "2026-04-01", expectedEndAt: "2027-03-31", status: ProjectStatus.Proposal, totalBudget: 260000, usedBudget: 12000 }
];

export const experiments: ExperimentRecord[] = [
  { id: "ex-001", projectId: "pr-immune", title: "CD8+T 细胞浸润比例测定", purpose: "验证样本中免疫细胞分布", method: "流式细胞术", stepsJson: { type: "doc", content: [{ type: "paragraph", text: "样本消化、抗体孵育、上机采集。" }] }, conclusion: "实验组浸润比例高于对照组。", experimentDate: "2026-06-08", experimenterId: "u-researcher", reviewerId: "u-pi", reviewStatus: ReviewStatus.Approved, reviewComment: "数据完整", attachmentUrls: ["/files/flow-0608.xlsx"] },
  { id: "ex-002", projectId: "pr-catalyst", title: "催化剂 A17 活性复测", purpose: "复核低温活性曲线", method: "固定床反应", stepsJson: { type: "doc", content: [{ type: "table", rows: 4 }] }, conclusion: "120 摄氏度活性异常，需要补测。", experimentDate: "2026-06-11", experimenterId: "u-student", reviewStatus: ReviewStatus.Submitted, attachmentUrls: [] }
];

export const reagents: Reagent[] = [
  { id: "rg-ethanol", name: "无水乙醇", casNo: "64-17-5", formula: "C2H6O", purity: "99.7%", hazardLevel: HazardLevel.Flammable, storageCondition: StorageCondition.Ventilated, supplier: "国药试剂", stock: 4.5, unit: "L", minStock: 5, location: "危化柜-2层" },
  { id: "rg-pbs", name: "PBS 缓冲液", casNo: "N/A", formula: "Buffer", purity: "1x", hazardLevel: HazardLevel.Safe, storageCondition: StorageCondition.RoomTemp, supplier: "赛默飞", stock: 18, unit: "瓶", minStock: 6, location: "试剂间-A3" },
  { id: "rg-acid", name: "盐酸", casNo: "7647-01-0", formula: "HCl", purity: "36%", hazardLevel: HazardLevel.Corrosive, storageCondition: StorageCondition.Ventilated, supplier: "麦克林", stock: 900, unit: "mL", minStock: 500, location: "酸碱柜-B1" }
];

export const reagentUsages: ReagentUsage[] = [
  { id: "use-001", reagentId: "rg-ethanol", userId: "u-researcher", quantity: 0.5, usedAt: "2026-06-09", experimentId: "ex-001", purpose: "样本固定", approverId: "u-pi" },
  { id: "use-002", reagentId: "rg-pbs", userId: "u-student", quantity: 2, usedAt: "2026-06-10", experimentId: "ex-002", purpose: "样本清洗", approverId: "u-researcher" }
];

export const members: ProjectMember[] = [
  { id: "mb-001", projectId: "pr-immune", userId: "u-pi", role: "PI", joinedAt: "2026-01-15" },
  { id: "mb-002", projectId: "pr-immune", userId: "u-researcher", role: "Researcher", joinedAt: "2026-01-20" },
  { id: "mb-003", projectId: "pr-catalyst", userId: "u-student", role: "Student", joinedAt: "2025-10-08" }
];

export const auditLogs: AuditLog[] = [
  { id: "log-001", actorId: "u-researcher", action: "SUBMIT_EXPERIMENT", entity: "ExperimentRecord", entityId: "ex-001", createdAt: "2026-06-08T21:00:00+08:00" },
  { id: "log-002", actorId: "u-pi", action: "APPROVE_EXPERIMENT", entity: "ExperimentRecord", entityId: "ex-001", createdAt: "2026-06-09T09:30:00+08:00" }
];
