import { buildApp } from "./app.ts";
import { env } from "./config/env.ts";

const app = await buildApp();

app.listen({ host: "0.0.0.0", port: env.PORT });

const shutdown = async () => {
  try {
    app.log.info("[AUTH-SERVICE] Closing service..");
    await app.close();
    process.exit(0);
  } catch {
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
