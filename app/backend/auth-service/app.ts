import Fastify from "fastify";
import auth from "./plugins/auth.ts";
import pg from "./plugins/postgres.ts";
import cors from "./plugins/cors.ts";
import authRoutes from "./modules/auth/auth.routes.ts";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors);
  await app.register(pg);
  await app.register(auth);

  await app.register(authRoutes);

  app.get("/health", () => ({ status: "OK" }));

  return app;
}
