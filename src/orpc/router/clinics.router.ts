import { db } from "#/db";
import { clinics } from "#/db/schema";
import { os } from "@orpc/server";
import { zClinicCreateSchema } from "../schema";

export const createClinic = os
  .input(zClinicCreateSchema)
  .handler(async ({ input }) => {
    const [created] = await db
      .insert(clinics)
      .values({
        name: input.name,
        status: input.status,
        address: input.address,
      })
      .returning();
    return { data: created, error: null };
  });

export const listClinics = os.handler(async () => {
  const listOfClinics = await db.query.clinics.findMany();
  return { data: listOfClinics, error: null };
});
