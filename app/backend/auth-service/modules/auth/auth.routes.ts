import type { FastifyInstance } from "fastify";
import { LoginBody, RegisterBody } from "./auth.schemas.ts";
import makeAuthController from "./auth.controller.ts";

export default async function authRoutes(app: FastifyInstance) {
  const ctrl = makeAuthController(app);

  app.post("/register", { schema: { body: RegisterBody } }, ctrl.register);
  app.post("/login", { schema: { body: LoginBody } }, ctrl.login);

  app.get("/me", { onRequest: [app.authenticate] }, ctrl.me);
  app.get("/refresh", { onRequest: [app.authenticate] }, ctrl.refresh);
}
