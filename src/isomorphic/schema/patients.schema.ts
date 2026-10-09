import { patients } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { zAddressSchema } from "./utils.schema";

export const zPatientSchema = createSelectSchema(patients, {
  id: z.uuid(),
  gender: z.union([z.literal("male"), z.literal("female"), z.literal("other")]),
  address: z.nullish(zAddressSchema()),
  email: (s) => s.optional(),
});
export type Patient = z.infer<typeof zPatientSchema>;

export const zCreatePatientSchema = zPatientSchema.omit({
  patient_no: true,
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreatePatientSchema = z.infer<typeof zCreatePatientSchema>;
