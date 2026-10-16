import { z } from "zod";
import { zAddressSchema } from "./utils.schema";
import { zClinicSchema } from "./clinics.schema";
import { zSpecialtySchema } from "./specialties.schema";
import { createSelectSchema } from "drizzle-orm/zod";
import { practitionersTable } from "#/db/db.schema.ts";

export const zPractitionerSchema = createSelectSchema(practitionersTable, {
  address: z.nullish(zAddressSchema()),
}).extend({
  clinics: z.nullish(zClinicSchema),
  practitioners_specialties: z.nullish(zSpecialtySchema),
});
export type Practitioner = z.infer<typeof zPractitionerSchema>;

export const zPractitionerFormSchema = zPractitionerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  clinics: true,
  practitioners_specialties: true,
});
export type PractitionerFormSchema = z.infer<typeof zPractitionerFormSchema>;

export const zPractitionerCreateSchema = zPractitionerFormSchema;
export type PractitionerCreateSchema = z.infer<
  typeof zPractitionerCreateSchema
>;

export const zPractitionerUpdateSchema = zPractitionerFormSchema;
export type PractitionerUpdateSchema = z.infer<
  typeof zPractitionerUpdateSchema
>;
