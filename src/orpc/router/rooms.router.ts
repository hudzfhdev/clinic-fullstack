import { roomsTable } from "#/db/db.schema.ts";
import { db } from "#/db/index.ts";
import {
  zCreateRoomSchema,
  zRoomSchema,
} from "#/isomorphic/schema/rooms.schema.ts";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const TAGS = ["Rooms"];

export const createRoom = os
  .route({ tags: TAGS, summary: "Add Room" })
  .input(zCreateRoomSchema)
  .handler(async ({ input }) => {
    const [created] = await db
      .insert(roomsTable)
      .values({
        name: input.name,
        description: input.description,
        clinic_id: input.clinic_id,
      })
      .returning();
    return created;
  });

export const listRooms = os
  .route({ tags: TAGS, summary: "List of Rooms" })
  .output(z.array(zRoomSchema))
  .input(
    z
      .object({ filter: z.object({ clinic_id: z.uuid() }) })
      .partial()
      .optional(),
  )
  .handler(async ({ input }) => {
    const rooms = await db.query.rooms.findMany({
      where: input?.filter
        ? { AND: [{ clinic_id: input.filter.clinic_id }] }
        : {},
      with: { clinic: true },
    });
    return rooms;
  });

export const deleteRoomById = os
  .route({ method: "DELETE", tags: TAGS, summary: "Delete Room by ID" })
  .input(z.object({ id: z.uuid() }))
  .handler(async ({ input }) => {
    await db.delete(roomsTable).where(eq(roomsTable.id, input.id));
    return { message: "Successfully deleted room data." };
  });
