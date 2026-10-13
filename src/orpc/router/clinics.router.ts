import { db } from "#/db";
import { clinicsTable } from "#/db/db.schema";
import { zClinicCreateSchema } from "#/isomorphic/schema/clinics.schema.ts";
import { ORPCError, os } from "@orpc/server";
import z from "zod";

const tags = ["Clinics"];

export const createClinic = os
  .route({ tags, summary: "Add Clinic" })
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

export const listClinics = os
  .route({ tags, summary: "List of Clinics" })
  .handler(async () => {
    const listOfClinics = await db.query.clinics.findMany({
      orderBy: (col, op) => op.desc(col.created_at),
      with: { patients: true },
    });
    return listOfClinics;
  });

export const getClinicByID = os
  .route({ tags, summary: "Get Clinic by ID" })
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
