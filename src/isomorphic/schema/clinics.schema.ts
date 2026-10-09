import { z } from "zod";
import { zAddressSchema, zTimeStampSchema } from "./utils.schema";

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
