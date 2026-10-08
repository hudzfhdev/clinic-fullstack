import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

const timestamp_tz = () => ({
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

const address = () =>
  jsonb().$type<{
    address_one: string;
    address_two?: string;
    postcode: string;
    state: string;
    city: string;
  }>();

export const clinics = pgTable("clinics", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  status: text().$type<"active" | "pending">().notNull().default("active"),
  address: address(),
  ...timestamp_tz(),
});

export const practitioners = pgTable("practitioners", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  status: text().$type<"active" | "suspended" | "inactive">().notNull(),
  gender: text().$type<"male" | "female" | "other">().notNull(),
  dob: text().notNull(),
  identification_no: text().unique().notNull(),
  address: address(),
  phone_number: text().unique().notNull(),
  clinic_id: uuid().references(() => clinics.id),
  email: text(),
  specialty_id: uuid()
    .references(() => practitioners_specialties.id)
    .notNull(),
  ...timestamp_tz(),
});

export const practitioners_specialties = pgTable("practitioners_specialties", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  category: text().notNull(),
  ...timestamp_tz(),
});

export const patients = pgTable("patients", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  gender: text().$type<"male" | "female" | "other">().notNull(),
  dob: text().notNull(),
  patient_no: text().unique().notNull(),
  identification_card: text().unique().notNull(),
  address: address(),
  phone_number: text().unique().notNull(),
  email: text(),
  clinic_id: uuid()
    .references(() => clinics.id)
    .notNull(),
  ...timestamp_tz(),
});
