import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { env } from "../config/env.ts";

export default fp(async (app) => {
  await app.register(cors, {
    origin: env.FRONTEND_URL || "http://localhost:3000",
  });
});
