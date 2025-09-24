process.loadEnvFile();

function requireEnv(name: string) {
  const variable = process.env[name];
  if (!variable) throw new Error(`[ENV] Missing ${name}`);
  return variable;
}

export const env = {
  PORT: Number(requireEnv("PORT")),
  FRONTEND_URL: requireEnv("FRONTEND_URL"),
  POSTGRES: {
    HOST: requireEnv("POSTGRES_HOST"),
    PORT: Number(requireEnv("POSTGRES_PORT")),
    USER: requireEnv("POSTGRES_USER"),
    PASSWORD: requireEnv("POSTGRES_PASSWORD"),
    DATABASE: requireEnv("POSTGRES_DB"),
  },
  JWT: {
    SECRET: requireEnv("JWT_SECRET"),
    ACCESS_TTL: requireEnv("JWT_ACCESS_TTL"),
    REFRESH_TTL: requireEnv("JWT_REFRESH_TTL"),
  },
};

export const DB_URL = `postgresql://${env.POSTGRES.USER}:${env.POSTGRES.PASSWORD}@${env.POSTGRES.HOST}:${env.POSTGRES.PORT}/${env.POSTGRES.DATABASE}`;
