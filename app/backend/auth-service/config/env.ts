process.loadEnvFile();

function requireEnv(name: string) {
  const variable = process.env[name];
  if (!variable) throw new Error(`[ENV] Missing ${name}`);
  return variable;
}

export const env = {
  PORT: Number(requireEnv("PORT")),
  FRONTEND_URL: requireEnv("FRONTEND_URL"),
  POSTGRES_HOST: requireEnv("POSTGRES_HOST"),
  POSTGRES_USER: requireEnv("POSTGRES_USER"),
  POSTGRES_PASSWORD: requireEnv("POSTGRES_PASSWORD"),
  POSTGRES_DB: requireEnv("POSTGRES_DB"),
  POSTGRES_PORT: Number(requireEnv("POSTGRES_PORT")),
  JWT_SECRET: requireEnv("JWT_SECRET"),
};
