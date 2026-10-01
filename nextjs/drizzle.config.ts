import { defineConfig } from "drizzle-kit";
for (const path of [".env.local", ".env.outreach.local"]) {
  try { process.loadEnvFile(path); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/outreach/schema.ts",
  out: "./outreach/migrations",
  dbCredentials: { url: process.env.OUTREACH_DATABASE_URL_UNPOOLED || "" },
});
