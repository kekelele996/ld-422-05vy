import type { HazardLevelValue, ProjectStatusValue, ReviewStatusValue, StorageConditionValue, UserRole } from "./enums.ts";

export type User = { id: string; name: string; role: UserRole };
export type ResearchProject = {
  id: string;
  name: string;
  projectNo: string;
  leaderId: string;
  direction: "Biology" | "Chemistry" | "Physics" | "Materials" | "CS" | "Other";
  startedAt: string;
  expectedEndAt: string;
  actualEndAt?: string;
  status: ProjectStatusValue;
  totalBudget: number;
  usedBudget: number;
};
export type ExperimentRecord = {
  id: string;
  projectId: string;
  title: string;
  purpose: string;
  method: string;
  stepsJson: Record<string, unknown>;
  conclusion: string;
  experimentDate: string;
  experimenterId: string;
  reviewerId?: string;
  reviewStatus: ReviewStatusValue;
  reviewComment?: string;
  attachmentUrls: string[];
};
export type Reagent = {
  id: string;
  name: string;
  casNo: string;
  formula: string;
  purity: string;
  hazardLevel: HazardLevelValue;
  storageCondition: StorageConditionValue;
  supplier: string;
  stock: number;
  unit: "g" | "mL" | "L" | "mol" | "瓶";
  minStock: number;
  location: string;
};
export type ReagentUsage = {
  id: string;
  reagentId: string;
  userId: string;
  quantity: number;
  usedAt: string;
  experimentId: string;
  purpose: string;
  approverId?: string;
};
export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: "PI" | "SubPI" | "Researcher" | "Student" | "Assistant";
  joinedAt: string;
};
export type AuditLog = { id: string; actorId: string; action: string; entity: string; entityId: string; createdAt: string };
