import { drizzle } from "drizzle-orm/node-postgres";
import { clinics } from "./schema.db";

export const db = drizzle(process.env.DATABASE_URL!, { schema: { clinics } });
