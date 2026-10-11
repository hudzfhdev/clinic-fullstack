import { db } from "#/db";
import { clinicsTable } from "#/db/db.schema";
import { zClinicCreateSchema } from "#/isomorphic/schema/clinics.schema.ts";
import { ORPCError, os } from "@orpc/server";
import z from "zod";

export const createClinic = os
  .input(zClinicCreateSchema)
  .handler(async ({ input }) => {
    const [created] = await db
      .insert(clinicsTable)
      .values({
        name: input.name,
        status: input.status,
        address: input.address,
      })
      .returning();
    return created;
  });

export const listClinics = os.handler(async () => {
  const listOfClinics = await db.query.clinics.findMany({
    orderBy: (col, op) => op.desc(col.created_at),
    with: { patients: true },
  });
  return listOfClinics;
});

export const getClinicByID = os
  .input(z.object({ clinic_id: z.uuid() }))
  .handler(async ({ input }) => {
    const { clinic_id } = input;
    const clinic = await db.query.clinics.findFirst({
      where: { id: clinic_id },
    });
    if (!clinic) {
      throw new ORPCError("NOT_FOUND", { message: "clinic not found." });
    }
    return clinic;
  });
