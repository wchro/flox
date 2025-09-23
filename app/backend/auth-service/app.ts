// TODO: Refactorizar y organizar bloques de codigo

import Fastify from "fastify";
import type { FastifyRequest } from "fastify";
import type { PoolClient } from "pg";
import { comparePassword, hashPassword } from "./utils/hash.ts";
import auth from "./plugins/auth.ts";
import { env } from "./config/env.ts";
import pg from "./plugins/postgres.ts";
import cors from "./plugins/cors.ts";

const DB_URL = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

const fastify = Fastify({
  logger: true,
});

// cors
await fastify.register(cors);

// plugin postgre
await fastify.register(pg);

// plugin jwt - auth
await fastify.register(auth);

// esquemas
// NOTA: registro y login ahora mismo son iguales
// pero en el futuro pueden cambiar, se separan desde ya
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

const loginBodySchema = {
  type: "object",
  required: ["username", "password"],
  additionalProperties: false,
  properties: {
    username: { type: "string", minLength: 3, maxLength: 32 },
    password: { type: "string", minLength: 8, maxLength: 128 },
  },
} as const;

type LoginBody = {
  username: string;
  password: string;
};

// rutas

// register endpoint
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

      // generar tokens
      const accessToken = fastify.jwt.sign(
        { sub: user.id, typ: "access" },
        { expiresIn: "15m", iss: "auth-svc", aud: "external" }
      );

      const refreshToken = fastify.jwt.sign(
        { sub: user.id, typ: "refresh" },
        { expiresIn: "7d", iss: "auth-svc", aud: "external" }
      );

      return res.code(201).send({
        success: true,
        message: "User successfully registered",
        data: {
          id: user.id,
          username: user.username,
          accessToken,
          refreshToken,
        },
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

// login endpoint
fastify.post(
  "/login",
  { schema: { body: loginBodySchema } },
  async (req: FastifyRequest<{ Body: LoginBody }>, res) => {
    try {
      const { username, password } = req.body;

      const user = await fastify.pg.transact(async (client: PoolClient) => {
        const query = "SELECT * FROM auth WHERE username=$1";
        const variables = [username];

        const { rows } = await client.query(query, variables);

        return rows[0];
      });

      if (!user)
        return res.code(401).send({
          success: false,
          message: "Invalid username or password",
        });

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword)
        return res.code(401).send({
          success: false,
          message: "Invalid username or password",
        });

      const accessToken = fastify.jwt.sign(
        { sub: user.id, typ: "access" },
        { expiresIn: "15m", iss: "auth-svc", aud: "external" }
      );

      const refreshToken = fastify.jwt.sign(
        { sub: user.id, typ: "refresh" },
        { expiresIn: "7d", iss: "auth-svc", aud: "external" }
      );

      res.send({
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          username: user.username,
          accessToken,
          refreshToken,
        },
      });
    } catch {
      return res.code(500).send({
        success: false,
        message: "An unknown error occurred",
      });
    }
  }
);

// me endpoint
fastify.get(
  "/me",
  { onRequest: [fastify.authenticate] },
  async (req: FastifyRequest, res) => {
    try {
      const user = await fastify.pg.transact(async (client: PoolClient) => {
        const query = `SELECT * FROM auth WHERE id=$1`;
        const variables = [req.user.sub];

        const { rows } = await client.query(query, variables);

        return rows[0];
      });
      return res.send({
        success: true,
        data: { id: user.id, username: user.username },
      });
    } catch {
      return res.code(500).send({
        success: false,
        message: "An unknown error occurred",
      });
    }
  }
);

// refresh endpoint
fastify.get(
  "/refresh",
  { onRequest: [fastify.authenticate] },
  async (req: FastifyRequest, res) => {
    try {
      if (req.user.typ !== "refresh")
        return res
          .code(401)
          .send({ success: false, message: "Invalid token type" });

      // generar tokens nuevos
      const accessToken = fastify.jwt.sign(
        { sub: req.user.sub, typ: "access" },
        { expiresIn: "15m", iss: "auth-svc", aud: "external" }
      );

      const refreshToken = fastify.jwt.sign(
        { sub: req.user.sub, typ: "refresh" },
        { expiresIn: "7d", iss: "auth-svc", aud: "external" }
      );

      // devolver tokens
      res.send({ success: true, data: { accessToken, refreshToken } });
    } catch {
      return res.code(500).send({
        success: false,
        message: "An unknown error occurred",
      });
    }
  }
);

// health endpoint
fastify.get("/health", () => ({ status: "OK" }));

fastify.listen({ host: "0.0.0.0", port: env.PORT || 3000 });

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
