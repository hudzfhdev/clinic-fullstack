import { defineRelations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  date,
  pgEnum,
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

export const clinicStatusEnum = pgEnum("clinicStatusEnum", [
  "active",
  "pending",
  "inactive",
]);
export const clinicsTable = pgTable("clinics", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  status: clinicStatusEnum().notNull(),
  address: address(),
  start_time: time(),
  end_time: time(),
  timezone: text().default("GMT").notNull(),
  ...timestamp_tz(),
});

export const genderEnum = pgEnum("gender_enum", ["male", "female", "other"]);
export const titleEnum = pgEnum("title_enum", ["MR", "MRS"]);
export const practitionerStatusEnum = pgEnum("practitioner_status_enum", [
  "active",
  "suspended",
  "inactive",
]);
export const practitionersTable = pgTable("practitioners", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  title: titleEnum().notNull(),
  status: practitionerStatusEnum().notNull(),
  gender: genderEnum().notNull(),
  dob: date({ mode: "string" }).notNull(),
  identification_no: text().unique().notNull(),
  address: address(),
  phone_number: text().notNull(),
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
  title: titleEnum().notNull(),
  name: text().notNull(),
  gender: genderEnum().notNull(),
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
  clinic_id: uuid()
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

export const roomStatusEnum = pgEnum("room_status", ["available", "closed"]);
export const roomsTable = pgTable("rooms", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  description: text(),
  status: roomStatusEnum().notNull(),
  clinic_id: uuid()
    .references(() => clinicsTable.id)
    .notNull(),
  ...timestamp_tz(),
});

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "in_queue",
  "in_progress",
  "done",
]);
export const appointmentsTable = pgTable("appointments", {
  id: uuid().defaultRandom().primaryKey(),
  duration: text().notNull(),
  start_time: date().notNull(),
  end_time: date().notNull(),
  status: appointmentStatusEnum().notNull(),
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
  service_id: uuid()
    .references(() => servicesTable.id)
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

export const serviceStatusEnum = pgEnum("service_status_enum", [
  "available",
  "not_available",
]);
export const servicesTable = pgTable("services", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  status: serviceStatusEnum().notNull(),
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
      practitioner: r.one.practitioners({
        from: r.appointments.practitioner_id,
        to: r.practitioners.id,
      }),
      patient: r.one.patients({
        from: r.appointments.patient_id,
        to: r.patients.id,
      }),
      clinic: r.one.clinics({
        from: r.appointments.clinic_id,
        to: r.clinics.id,
      }),
    },
    patient_vitals: {
      patients: r.one.patients({
        from: r.patient_vitals.patient_id,
        to: r.patients.id,
      }),
    },
    rooms: {
      clinic: r.one.clinics({
        from: r.rooms.clinic_id,
        to: r.clinics.id,
      }),
    },
    services: {
      clinic: r.one.clinics({
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
