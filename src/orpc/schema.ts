import { z } from "zod";

export const zClinicCreateSchema = z.object({
  name: z.string().min(3),
  status: z.union([z.literal("active"), z.literal("pending")]),
  address: z
    .object({
      address_one: z.string().min(1),
      address_two: z.string().min(1).nullable().optional(),
      city: z.string().min(1),
      postcode: z.string().min(1),
      state: z.string().min(1),
    })
    .optional(),
});

export type InferredClinicCreateSchema = z.infer<typeof zClinicCreateSchema>;
