import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

for (const path of [".env.local", ".env.outreach.local"]) {
  try { process.loadEnvFile(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
}
const url = process.env.OUTREACH_DATABASE_URL_UNPOOLED;
if (!url || new URL(url).hostname.includes("-pooler")) throw new Error("Set OUTREACH_DATABASE_URL_UNPOOLED to a direct Neon connection.");
try {
  await migrate(drizzle(neon(url)), { migrationsFolder: "outreach/migrations" });
  console.log("Outreach migrations applied.");
} catch (error) {
  console.error("Outreach migration failed", { name: error.name, code: error.code, message: String(error.message).replace(/postgres(?:ql)?:\/\/[^\s]+/g, "[redacted]") });
  process.exitCode = 1;
}
