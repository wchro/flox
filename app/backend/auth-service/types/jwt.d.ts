import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      typ: "access" | "refresh";
      tv?: number;
      role?: string;
      jti?: string;
    };
    user: {
      sub: string;
      typ: "access" | "refresh";
      tv?: number;
      role?: string;
      jti?: string;
    };
  }
}
