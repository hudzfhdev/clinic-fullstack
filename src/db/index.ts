import { drizzle } from "drizzle-orm/node-postgres";
import { clinics, practitioners_specialties, practitioners } from "./db.schema";
import { config } from "dotenv";

config();

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    clinics,
    practitioners,
    practitioners_specialties,
  },
});
