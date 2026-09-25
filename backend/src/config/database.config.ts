export const databaseConfig = {
  provider: "postgresql",
  url: process.env.DATABASE_URL ?? "postgresql://research_user:research_password@127.0.0.1:5432/research_lab"
};
