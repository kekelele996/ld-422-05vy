export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? "research-lab-dev-secret",
  expiresIn: "8h"
};
