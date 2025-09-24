import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { makeAuthService } from "./auth.service.ts";

export default function makeAuthController(app: FastifyInstance) {
  const svc = makeAuthService(app);
  return {
    register: async (req: FastifyRequest, reply: FastifyReply) => {
      const { username, password } = req.body as any;
      const out = await svc.register(username, password);
      if ("conflict" in out)
        return reply.code(409).send({
          success: false,
          message: "Username already exists",
        });

      return reply.code(201).send({
        success: true,
        message: "User successfully registered",
        data: out,
      });
    },
    login: async (req: FastifyRequest, reply: FastifyReply) => {
      const { username, password } = req.body as any;
      const out = await svc.login(username, password);
      if ("unauthorized" in out)
        return reply.code(401).send({
          success: false,
          message: "Invalid username or password",
        });
      return reply.send({
        success: true,
        message: "Login successful",
        data: out,
      });
    },
    me: async (req: FastifyRequest, reply: FastifyReply) => {
      const out = svc.me(req.user.sub);
      if ("conflict" in out)
        return reply.code(500).send({
          success: false,
          message: "An unknown error occurred",
        });
      return reply.send({
        success: true,
        data: out,
      });
    },
    refresh: async (req: FastifyRequest, reply: FastifyReply) => {
      const { sub, typ } = req.user;
      const out = await svc.refresh(sub, typ);

      if ("unauthorized" in out)
        return reply
          .code(401)
          .send({ success: false, message: "Invalid token type" });

      return reply.send({
        success: true,
        data: out,
      });
    },
  };
}
