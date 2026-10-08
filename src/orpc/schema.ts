import type { InferClientOutputs } from "@orpc/client";
import { z } from "zod";
import type { client } from "./client";

export type OutputRouter = InferClientOutputs<typeof client>;

/* REUSABLE SCHEMA */

const zAddressSchema = () =>
  z.object({
    address_one: z.string().min(1),
    address_two: z.string().optional(),
    city: z.string().min(1),
    postcode: z.string().min(1),
    state: z.string().min(1),
  });

const zTimeStampSchema = () => ({
  created_at: z.string(),
  updated_at: z.string(),
});

/* CLINIC SCHEMA */

export const zClinicSchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    status: z.union([z.literal("active"), z.literal("pending")]),
    address: z.nullish(zAddressSchema()),
  })
  .extend(zTimeStampSchema());
export type Clinic = z.infer<typeof zClinicSchema>;

export const zClinicCreateSchema = z.object({
  name: z.string().min(3),
  status: z.union([z.literal("active"), z.literal("pending")]),
  address: z.nullish(zAddressSchema()),
});
export type ClinicCreateSchema = z.infer<typeof zClinicCreateSchema>;

/* PRACTITIONER SCHEMA */

export const zPractitionerSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(3),
    status: z.union([
      z.literal("active"),
      z.literal("inactive"),
      z.literal("suspended"),
    ]),
    gender: z.union([
      z.literal("male"),
      z.literal("female"),
      z.literal("other"),
    ]),
    dob: z.string(),
    identification_no: z.string().length(12),
    phone_number: z
      .string()
      .regex(/^01[0-9]{8,9}$/i, { error: "Incorrect phone number format." }),
    address: z.nullish(zAddressSchema()),
    clinic_id: z.nullish(z.string()),
    specialty_id: z.uuid(),
  })
  .extend(zTimeStampSchema());
export type Practitioner = z.infer<typeof zPractitionerSchema>;

export const zPractitionerCreateSchema = zPractitionerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type PractitionerCreateSchema = z.infer<
  typeof zPractitionerCreateSchema
>;

/* PRACTITIONER SPECIALTY SCHEMA */
export const zSpecialtySchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    category: z.string(),
  })
  .extend(zTimeStampSchema());
export type Specialty = z.infer<typeof zSpecialtySchema>;
