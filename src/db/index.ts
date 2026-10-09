import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "dotenv";
import { relations } from "./db.schema";

config();

export const db = drizzle(process.env.DATABASE_URL!, { relations: relations });
