import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

const timestamp_tz = () => ({
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const clinics = pgTable("clinics", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  status: text().$type<"active" | "pending">().notNull().default("active"),
  address: jsonb().$type<{
    address_one: string;
    address_two?: string;
    postcode: string;
    state: string;
    city: string;
  }>(),
  ...timestamp_tz(),
});

export const practitioners = pgTable("practitioners", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  ...timestamp_tz(),
});
