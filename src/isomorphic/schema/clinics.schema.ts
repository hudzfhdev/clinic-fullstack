import { z } from "zod";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { clinicsTable } from "#/db/db.schema.ts";
import { zAddressSchema } from "./utils.schema";

export const zClinicSchema = createSelectSchema(clinicsTable, {
  address: z.nullish(zAddressSchema()),
});
export type Clinic = z.infer<typeof zClinicSchema>;

export const zClinicCreateSchema = createInsertSchema(clinicsTable, {
  address: z.nullish(zAddressSchema()),
}).omit({
  id: true,
  updated_at: true,
  created_at: true,
});
export type ClinicCreateSchema = z.infer<typeof zClinicCreateSchema>;

export const zUpdateClinicSchema = createUpdateSchema(clinicsTable, {
  address: z.nullish(zAddressSchema()),
});
export type UpdateClinicSchema = z.infer<typeof zUpdateClinicSchema>;
