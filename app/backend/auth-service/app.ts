// TODO: Refactorizar y organizar bloques de codigo

import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import type { FastifyRequest } from "fastify";
import type { PoolClient } from "pg";
import { hashPassword } from "./utils/hash.ts";

process.loadEnvFile(); // cargar variables de entorno
const DB_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

const fastify = Fastify({
  logger: true,
});

// plugin postgre
fastify.register(fastifyPostgres, {
  connectionString: DB_URL,
});

// esquemas
const registerBodySchema = {
  type: "object",
  required: ["username", "password"],
  additionalProperties: false,
  properties: {
    username: { type: "string", minLength: 3, maxLength: 32 },
    password: { type: "string", minLength: 8, maxLength: 128 },
  },
} as const;

type RegisterBody = {
  username: string;
  password: string;
};

// rutas
fastify.post(
  "/register",
  { schema: { body: registerBodySchema } },
  async (req: FastifyRequest<{ Body: RegisterBody }>, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await hashPassword(password);

      const user = await fastify.pg.transact(async (client: PoolClient) => {
        const query =
          "INSERT INTO auth (username, password) VALUES ($1, $2) RETURNING id, username";
        const variables = [username, hashedPassword];
        const { rows } = await client.query(query, variables);

        return rows[0];
      });

      // por si las moscas el usuario no se ha registrado
      if (!user)
        return res.code(500).send({
          success: false,
          message: "An unknown error occurred while creating the user",
        });

      return res.code(201).send({
        success: true,
        message: "User successfully registered",
        data: user,
      });
    } catch (error: any) {
      switch (error.code) {
        case "23505":
          return res.code(409).send({
            success: false,
            message: "Username already exists",
          });
        default:
          req.log.error(
            { error },
            "An unknown error occurred while creating the user"
          );
          return res.code(500).send({
            success: false,
            message: "An unknown error occurred",
          });
      }
    }
  }
);

fastify.get("/health", () => ({ status: "OK" }));

fastify.listen({ host: "0.0.0.0", port: process.env.PORT || 3000 });

// Apagado
const shutdown = async () => {
  try {
    console.log("[AUTH-SERVICE] Closing service..");
    await fastify.close();
    process.exit(0);
  } catch {
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
