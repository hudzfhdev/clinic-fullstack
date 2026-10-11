import { servicesTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const zServiceSchema = createSelectSchema(servicesTable);
export type Room = z.infer<typeof zServiceSchema>;

export const zCreateServiceSchema = createInsertSchema(servicesTable);
export type CreateRoomSchema = z.infer<typeof zCreateServiceSchema>;
