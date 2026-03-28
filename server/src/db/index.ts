import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool, { schema });

export async function checkDBConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected!");
  } catch (e) {
    console.error("❌ Database connection failed:", e);
    process.exit(1);
  }
}
