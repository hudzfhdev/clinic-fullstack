import { roomsTable } from "#/db/db.schema.ts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const zRoomStatusSchema = z.union([
  z.literal("idle"),
  z.literal("in_used"),
  z.literal("closed"),
]);
export const zRoomSchema = createSelectSchema(roomsTable, {
  status: zRoomStatusSchema,
});
export type Room = z.infer<typeof zRoomSchema>;

export const zCreateRoomSchema = createInsertSchema(roomsTable, {
  status: zRoomStatusSchema,
}).omit({
  id: true,
  updated_at: true,
  created_at: true,
});
export type CreateRoomSchema = z.infer<typeof zCreateRoomSchema>;
