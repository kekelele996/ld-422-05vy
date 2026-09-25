import type { UserRole } from "./enums";

export type User = { id: string; name: string; role: UserRole };

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: "PI" | "SubPI" | "Researcher" | "Student" | "Assistant";
  joinedAt: string;
  user?: User;
};
