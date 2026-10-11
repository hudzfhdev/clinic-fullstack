import { defineRelations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  date,
  time,
} from "drizzle-orm/pg-core";

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

export const clinicsTable = pgTable("clinics", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  status: text().$type<"active" | "pending">().notNull().default("active"),
  address: address(),
  ...timestamp_tz(),
});

export const practitionersTable = pgTable("practitioners", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  title: text().notNull().$type<"MR" | "MRS">(),
  status: text().$type<"active" | "suspended" | "inactive">().notNull(),
  gender: text().$type<"male" | "female">().notNull(),
  dob: date({ mode: "string" }).notNull(),
  identification_no: text().unique().notNull(),
  address: address(),
  phone_number: text().unique().notNull(),
  clinic_id: uuid().references(() => clinicsTable.id),
  email: text(),
  specialty_id: uuid()
    .references(() => specialtiesTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const specialtiesTable = pgTable("practitioners_specialties", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  category: text().notNull(),
  ...timestamp_tz(),
});

export const patientsTable = pgTable("patients", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull().$type<"MR" | "MRS">(),
  name: text().notNull(),
  gender: text().$type<"male" | "female" | "other">().notNull(),
  dob: date({ mode: "string" }).notNull(),
  patient_no: text().unique().notNull(),
  identification_card: text().unique().notNull(),
  address: address(),
  phone_number: text().unique().notNull(),
  email: text(),
  clinic_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const patientVitalsTable = pgTable("patient_vitals", {
  id: uuid().defaultRandom().primaryKey(),
  oxygen_level: text(),
  blood_pressure_level: text(),
  heart_rate: text(),
  temperature: text(),
  patient_id: uuid()
    .references(() => patientsTable.id)
    .notNull(),
  clinid_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  ...timestamp_tz(),
});

// export const patientHistoriesTable = pgTable("patient_histories", {
//   id: uuid().defaultRandom().primaryKey(),
//   start_date: text(),
//   end_date: text(),
//   symptopm: text().notNull(),
//   description: text(),
//   patient_id: uuid()
//     .references(() => patientsTable.id)
//     .notNull(),
// });

export const roomsTable = pgTable("rooms", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  status: text()
    .notNull()
    .default("idle")
    .$type<"idle" | "in_used" | "closed">(),
  description: text(),
  clinic_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const appointmentsTable = pgTable("appointments", {
  id: uuid().defaultRandom().primaryKey(),
  duration: text().notNull(),
  start_time: time().notNull(),
  end_time: time().notNull(),
  status: text()
    .notNull()
    .$type<"pending" | "in_queue" | "in_progress" | "done">(),
  room_id: uuid()
    .references(() => roomsTable.id)
    .notNull(),
  patient_id: uuid()
    .references(() => patientsTable.id)
    .notNull(),
  clinic_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  practitioner_id: uuid()
    .references(() => practitionersTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const consultationsTable = pgTable("consultations", {
  id: uuid().defaultRandom().primaryKey(),
  note: text().notNull(),
  clinic_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  practitioner_id: uuid()
    .references(() => practitionersTable.id)
    .notNull(),
  patient_id: uuid()
    .references(() => patientsTable.id)
    .notNull(),
  appointment_id: uuid()
    .references(() => appointmentsTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const servicesTable = pgTable("services", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  description: text(),
  clinic_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const relations = defineRelations(
  {
    patients: patientsTable,
    practitioners: practitionersTable,
    practitioners_specialties: specialtiesTable,
    clinics: clinicsTable,
    rooms: roomsTable,
    appointments: appointmentsTable,
    consultations: consultationsTable,
    services: servicesTable,
    patient_vitals: patientVitalsTable,
  },
  (r) => ({
    appointments: {
      // patient: r.one.patients({
      //   from: r.appointments.patient_id,
      //   to: r.patients.id,
      // }),
    },
    patient_vitals: {
      patients: r.one.patients({
        from: r.patient_vitals.patient_id,
        to: r.patients.id,
      }),
    },
    rooms: {
      clinics: r.one.clinics({
        from: r.rooms.clinic_id,
        to: r.clinics.id,
      }),
    },
    services: {
      clinics: r.one.clinics({
        from: r.services.clinic_id,
        to: r.clinics.id,
      }),
    },
    patients: {
      clinics: r.one.clinics({
        from: r.patients.clinic_id,
        to: r.clinics.id,
      }),
    },
    clinics: {
      patients: r.many.patients({
        from: r.clinics.id,
        to: r.patients.clinic_id,
      }),
    },
    practitioners: {
      clinics: r.one.clinics({
        from: r.practitioners.clinic_id,
        to: r.clinics.id,
      }),
      practitioners_specialties: r.one.practitioners_specialties({
        from: r.practitioners.specialty_id,
        to: r.practitioners_specialties.id,
      }),
    },
  }),
);
