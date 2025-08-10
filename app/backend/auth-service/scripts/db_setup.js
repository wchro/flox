import { Pool } from "pg";

process.loadEnvFile();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

try {
  console.log("[AUTH-SERVICE] Configuring the database");
  pool.query(
    "CREATE TABLE IF NOT EXISTS auth( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(255))"
  );
} catch (err) {
  console.error(err);
} finally {
  pool.end();
}
