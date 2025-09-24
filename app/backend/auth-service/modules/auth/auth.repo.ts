import type { FastifyInstance } from "fastify";
import type { AuthRepo, DbUser } from "./auth.types.ts";

export function makeAuthRepo(app: FastifyInstance): AuthRepo {
  return {
    async createUser(username, hashed) {
      const { rows } = await app.pg.query(
        "INSERT INTO auth (username, password) VALUES ($1, $2) RETURNING id, username",
        [username, hashed]
      );
      return rows[0];
    },
    async getUser(username, column = "username") {
      const { rows } = await app.pg.query(
        `SELECT id, username, password FROM auth WHERE ${column}=$1`,
        [username]
      );
      return rows[0] as DbUser | undefined;
    },
  };
}
