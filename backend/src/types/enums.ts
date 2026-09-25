export const ProjectStatus = {
  Proposal: "Proposal",
  Active: "Active",
  Suspended: "Suspended",
  Completed: "Completed",
  Archived: "Archived"
} as const;

export const ReviewStatus = {
  Draft: "Draft",
  Submitted: "Submitted",
  Approved: "Approved",
  Rejected: "Rejected",
  RevisionRequired: "RevisionRequired"
} as const;

export const HazardLevel = {
  Safe: "Safe",
  Irritant: "Irritant",
  Corrosive: "Corrosive",
  Flammable: "Flammable",
  Toxic: "Toxic",
  Explosive: "Explosive"
} as const;

export const StorageCondition = {
  RoomTemp: "RoomTemp",
  Refrigerated: "Refrigerated",
  Frozen: "Frozen",
  Dark: "Dark",
  Ventilated: "Ventilated"
} as const;

export type ProjectStatusValue = (typeof ProjectStatus)[keyof typeof ProjectStatus];
export type ReviewStatusValue = (typeof ReviewStatus)[keyof typeof ReviewStatus];
export type HazardLevelValue = (typeof HazardLevel)[keyof typeof HazardLevel];
export type StorageConditionValue = (typeof StorageCondition)[keyof typeof StorageCondition];
export type UserRole = "Admin" | "PI" | "SubPI" | "Researcher" | "Student";
