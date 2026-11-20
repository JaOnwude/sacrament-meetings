import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";

// The Neon client is created on first use, so a missing DATABASE_URL gives a clear
// message when a query runs instead of crashing when the module is imported.
// <false, false> = the default mode: rows come back as an array of objects.
let cachedSql: NeonQueryFunction<false, false> | undefined;

export function getSql(): NeonQueryFunction<false, false> {
  if (!cachedSql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local` and restart.");
    }
    cachedSql = neon(databaseUrl);
  }
  return cachedSql;
}
