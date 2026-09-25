import type { ReviewStatus, UsageStatus } from "../types/enums";

export const USAGE_STATUS_LABELS: Record<UsageStatus, string> = {
  PendingApproval: "待审批",
  Received: "已领用",
  Cancelled: "已取消"
};

export const USAGE_STATUS_OPTIONS = (Object.keys(USAGE_STATUS_LABELS) as UsageStatus[]).map((value) => ({
  value,
  label: USAGE_STATUS_LABELS[value]
}));

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  Draft: "草稿",
  Submitted: "已提交",
  Approved: "已通过",
  Rejected: "已驳回",
  RevisionRequired: "要求修改"
};
