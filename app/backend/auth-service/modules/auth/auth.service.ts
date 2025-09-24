import type { FastifyInstance } from "fastify";
import { makeAuthRepo } from "./auth.repo.ts";
import { env } from "../../config/env.ts";
import { comparePassword, hashPassword } from "../../utils/hash.ts";

export function makeAuthService(app: FastifyInstance) {
  const repo = makeAuthRepo(app);

  const signAccess = (sub: string) =>
    app.jwt.sign(
      { sub, typ: "access" },
      { expiresIn: env.JWT.ACCESS_TTL, iss: "auth-svc", aud: "external" }
    );

  const signRefresh = (sub: string) =>
    app.jwt.sign(
      { sub, typ: "refresh" },
      { expiresIn: env.JWT.REFRESH_TTL, iss: "auth-svc", aud: "external" }
    );

  return {
    async register(username: string, password: string) {
      try {
        const hashedPassword = await hashPassword(password);
        const user = await repo.createUser(username, hashedPassword);
        return {
          user,
          accessToken: signAccess(user.id),
          refreshToken: signRefresh(user.id),
        };
      } catch (error: any) {
        if (error.code === "23505") return { conflict: true as const };
        throw error;
      }
    },

    async login(username: string, password: string) {
      const dbUser = await repo.getUser(username);
      if (!dbUser) return { unauthorized: true as const };

      const ok = await comparePassword(password, dbUser.password);
      if (!ok) return { unauthorized: true as const };

      return {
        user: { id: dbUser.id, username: dbUser.username },
        accessToken: signAccess(dbUser.id),
        refreshToken: signRefresh(dbUser.id),
      };
    },

    async me(userId: string) {
      const dbUser = await repo.getUser(userId, "id");
      if (!dbUser) return { conflict: true as const };
      return {
        data: { id: dbUser.id, username: dbUser.username },
      };
    },

    async refresh(sub: string, typ: string) {
      if (typ !== "refresh") return { unauthorized: true as const };
      return { accessToken: signAccess(sub), refreshToken: signRefresh(sub) };
    },
  };
}
