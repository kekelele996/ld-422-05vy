import { members, users } from "../prisma/seeds/seed.ts";

export const memberService = {
  list(projectId = "") {
    return members.filter((member) => !projectId || member.projectId === projectId).map((member) => ({
      ...member,
      user: users.find((user) => user.id === member.userId)
    }));
  }
};
