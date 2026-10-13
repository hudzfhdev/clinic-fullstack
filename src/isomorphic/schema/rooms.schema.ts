import { roomsTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { zClinicSchema } from "./clinics.schema";

export const zRoomSchema = createSelectSchema(roomsTable).extend({
  clinic: z.nullish(zClinicSchema),
});
export type Room = z.infer<typeof zRoomSchema>;

export const zCreateRoomSchema = createInsertSchema(roomsTable).omit({
  id: true,
  updated_at: true,
  created_at: true,
});
export type CreateRoomSchema = z.infer<typeof zCreateRoomSchema>;
