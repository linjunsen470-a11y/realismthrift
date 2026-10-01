import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { requiredSetting } from "./config";

let database: NeonHttpDatabase | undefined;
export function outreachDatabase() {
  // Lazy initialization lets the existing site build without outreach credentials.
  return database ??= drizzle(neon(requiredSetting("OUTREACH_DATABASE_URL")));
}
