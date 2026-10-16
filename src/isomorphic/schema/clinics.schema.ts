import { z } from "zod";
import { createSelectSchema } from "drizzle-orm/zod";
import { clinicsTable } from "#/db/db.schema.ts";
import { zAddressSchema } from "./utils.schema";

const zClinicSettingSchema = z.object({ timezone: z.string().optional() });

export const zClinicSchema = createSelectSchema(clinicsTable, {
  address: z.nullish(zAddressSchema()),
  settings: z.nullish(zClinicSettingSchema),
});
export type Clinic = z.infer<typeof zClinicSchema>;

export const zClinicFormSchema = zClinicSchema.pick({
  name: true,
  status: true,
  start_time: true,
  end_time: true,
  address: true,
});
export type ClinicFormSchema = z.infer<typeof zClinicFormSchema>;

export const zClinicCreateSchema = zClinicFormSchema;
export type ClinicCreateSchema = z.infer<typeof zClinicCreateSchema>;

export const zUpdateClinicSchema = zClinicFormSchema;
export type UpdateClinicSchema = z.infer<typeof zUpdateClinicSchema>;
