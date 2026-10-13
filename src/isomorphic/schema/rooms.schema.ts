import { roomsTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const zRoomSchema = createSelectSchema(roomsTable);
export type Room = z.infer<typeof zRoomSchema>;

export const zCreateRoomSchema = createInsertSchema(roomsTable).omit({
  id: true,
  updated_at: true,
  created_at: true,
});
export type CreateRoomSchema = z.infer<typeof zCreateRoomSchema>;
