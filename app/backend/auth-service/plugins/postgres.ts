import fastifyPostgres from "@fastify/postgres";
import fp from "fastify-plugin";
import { DB_URL } from "../config/env.ts";

export default fp(async (app) => {
  await app.register(fastifyPostgres, { connectionString: DB_URL });
});
