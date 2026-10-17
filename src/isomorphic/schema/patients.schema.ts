import { patientsTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { z } from "zod";
import { zAddressSchema } from "./utils.schema";

const zPatientEmergencyContactSchema = z.object({
  type: z.union([z.literal("phone"), z.literal("home"), z.literal("office")]),
  country_code: z.string(),
  phone_number: z.string(),
  full_name: z.string(),
  relationship: z.union([
    z.literal("guardians"),
    z.literal("family_members"),
    z.literal("friends"),
    z.literal("acquintances"),
    z.literal("colleagues"),
  ]),
});
export type PatientEmergencyContact = z.infer<
  typeof zPatientEmergencyContactSchema
>;

const zPatientContactSchema = zPatientEmergencyContactSchema
  .omit({ relationship: true, full_name: true })
  .extend({
    is_primary: z.boolean().default(false),
  });
export type PatientContact = z.infer<typeof zPatientContactSchema>;

export const zPatientSchema = createSelectSchema(patientsTable, {
  address: z.nullish(zAddressSchema()),
  emergency_contacts: z.nullish(z.array(zPatientEmergencyContactSchema).min(1)),
  contacts: z.array(zPatientContactSchema),
});
export type Patient = z.infer<typeof zPatientSchema>;

export const zCreatePatientSchema = createInsertSchema(patientsTable, {
  address: z.nullish(zAddressSchema()),
  emergency_contacts: z.nullish(z.array(zPatientEmergencyContactSchema).min(1)),
  contacts: z.array(zPatientContactSchema),
}).omit({
  patient_no: true,
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreatePatientSchema = z.infer<typeof zCreatePatientSchema>;

export const zUpdatePatientSchema = zPatientSchema.partial().omit({
  patient_no: true,
  id: true,
  created_at: true,
  updated_at: true,
});
export type UpdatePatientSchema = z.infer<typeof zUpdatePatientSchema>;
