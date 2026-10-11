import { z } from "zod";
import { zAddressSchema, zTimeStampSchema } from "./utils.schema";
import { zClinicSchema } from "./clinics.schema";
import { zSpecialtySchema } from "./specialties.schema";

export const zPractitionerSchema = z
  .object({
    id: z.uuid(),
    title: z.union([z.literal("MR"), z.literal("MRS")]),
    name: z.string().min(3),
    status: z.union([
      z.literal("active"),
      z.literal("inactive"),
      z.literal("suspended"),
    ]),
    gender: z.union([z.literal("male"), z.literal("female")]),
    dob: z.string(),
    identification_no: z.string().length(12),
    phone_number: z
      .string()
      .regex(/^01[0-9]{8,9}$/i, { error: "Incorrect phone number format." }),
    address: z.nullish(zAddressSchema()),
    clinic_id: z.nullish(z.string()),
    specialty_id: z.uuid(),
    email: z.nullish(z.email()),
  })
  .extend(zTimeStampSchema())
  .extend({
    clinics: z.nullish(zClinicSchema),
    practitioners_specialties: z.nullish(zSpecialtySchema),
  });

export type Practitioner = z.infer<typeof zPractitionerSchema>;

export const zPractitionerCreateSchema = zPractitionerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type PractitionerCreateSchema = z.infer<
  typeof zPractitionerCreateSchema
>;
