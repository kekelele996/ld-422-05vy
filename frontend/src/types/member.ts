export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: "PI" | "SubPI" | "Researcher" | "Student" | "Assistant";
  joinedAt: string;
};
