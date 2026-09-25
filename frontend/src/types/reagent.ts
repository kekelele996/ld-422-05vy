import type { HazardLevel, StorageCondition } from "./enums";

export type Reagent = {
  id: string;
  name: string;
  casNo: string;
  formula: string;
  purity: string;
  hazardLevel: HazardLevel;
  storageCondition: StorageCondition;
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
