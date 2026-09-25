import type { ReviewStatus } from "./enums";

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
  reviewStatus: ReviewStatus;
  reviewComment?: string;
  attachmentUrls: string[];
};
