import { db } from "#/db/index.ts";
import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import { zPractitionerCreateSchema } from "../schema";
import { practitioners } from "#/db/db.schema.ts";

export const listPractitioners = os.handler(async () => {
  return await db.query.practitioners.findMany({
    orderBy: (col, op) => op.desc(col.created_at),
  });
});

export const getPractitionerByID = os
  .input(z.object({ id: z.uuid() }))
  .handler(async ({ input }) => {
    const found = await db.query.practitioners.findFirst({
      where: (col, op) => op.eq(col.id, input.id),
      orderBy: (col, op) => op.desc(col.created_at),
    });
    if (!found) {
      throw new ORPCError("NOT_FOUND", { message: "Practitioner not found." });
    }
    return found;
  });

export const createPractitioner = os
  .input(zPractitionerCreateSchema)
  .handler(async ({ input }) => {
    const [newPractitioner] = await db
      .insert(practitioners)
      .values({
        name: input.name,
        dob: input.dob,
        gender: input.gender,
        address: input.address,
        identification_no: input.identification_no,
        phone_number: input.phone_number,
        clinic_id: input.clinic_id || null,
        specialty_id: input.specialty_id,
        status: input.status,
      })
      .returning();
    return newPractitioner;
  });
