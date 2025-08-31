import { fastifyPlugin } from "fastify-plugin";
import type {
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import type { FastifyJWTOptions } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

const authPlugin: FastifyPluginCallback = async (fastify) => {
  const { default: fastifyJwt } = await import("@fastify/jwt");

  const jwtOpts: FastifyJWTOptions = {
    secret: process.env.JWT_SECRET,
    verify: {
      allowedIss: ["auth-svc"],
      allowedAud: ["external"],
      requiredClaims: ["iss", "aud", "typ"],
    },
  };

  fastify.register(fastifyJwt, jwtOpts);

  fastify.decorate(
    "authenticate",
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void> {
      try {
        await request.jwtVerify({});
      } catch (err) {
        reply.send(err);
      }
    }
  );
};

export default fastifyPlugin(authPlugin);
