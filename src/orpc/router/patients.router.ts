import { patientsTable } from "#/db/db.schema.ts";
import { db } from "#/db/index.ts";
import {
  zCreatePatientSchema,
  zPatientSchema,
} from "#/isomorphic/schema/patients.schema.ts";
import { ORPCError, os } from "@orpc/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";

export const listPatients = os
  .output(z.array(zPatientSchema))
  .handler(async () => {
    return await db.query.patients.findMany();
  });

export const createPatient = os
  .input(zCreatePatientSchema)
  .handler(async ({ input }) => {
    const genNanoID = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ")();
    const patient_no = `PMC-${genNanoID}`;

    const [newPatient] = await db
      .insert(patientsTable)
      .values({
        clinic_id: input.clinic_id,
        title: input.title,
        dob: input.dob,
        gender: input.gender,
        identification_card: input.identification_card,
        name: input.name,
        patient_no: patient_no,
        phone_number: input.phone_number,
        address: input.address,
        email: input.email,
      })
      .returning();
    return newPatient;
  });

export const getPatientByID = os
  .input(z.object({ id: z.uuid() }))
  .output(zPatientSchema)
  .handler(async (ctx) => {
    const patient = await db.query.patients.findFirst({
      where: { id: ctx.input.id },
    });
    if (!patient) {
      throw new ORPCError("NOT_FOUND", { message: "Patient not found." });
    }
    return patient;
  });
