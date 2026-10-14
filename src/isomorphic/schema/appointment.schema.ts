import { appointmentsTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { z } from "zod";
import { zClinicSchema } from "./clinics.schema";
import { zPatientSchema } from "./patients.schema";
import { zPractitionerSchema } from "./practitioners.schema";

export const zAppointmentSchema = createSelectSchema(appointmentsTable).extend({
  clinic: z.nullish(zClinicSchema),
  patient: z.nullish(zPatientSchema),
  practitioner: z.nullish(zPractitionerSchema),
});
export type Appointment = z.infer<typeof zAppointmentSchema>;

export const zCreateAppointmentSchema = createInsertSchema(
  appointmentsTable,
).omit({
  id: true,
  created_at: true,
  duration: true,
  updated_at: true,
});
export type CreateAppointmentSchema = z.infer<typeof zCreateAppointmentSchema>;
