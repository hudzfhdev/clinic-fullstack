import { servicesTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const zServiceSchema = createSelectSchema(servicesTable);
export type Service = z.infer<typeof zServiceSchema>;

export const zCreateServiceSchema = createInsertSchema(servicesTable).omit({
  id: true,
  updated_at: true,
  created_at: true,
});
export type CreateServiceSchema = z.infer<typeof zCreateServiceSchema>;
