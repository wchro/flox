import Fastify from "fastify";

process.loadEnvFile();

const fastify = Fastify({
  logger: true,
});

fastify.get("/", (request, reply) => {
  reply.send({ status: "OK" });
});

fastify.listen({ port: process.env.PORT });
