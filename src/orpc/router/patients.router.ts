import { patientsTable } from "#/db/db.schema.ts";
import { db } from "#/db/index.ts";
import {
  zCreatePatientSchema,
  zPatientSchema,
} from "#/isomorphic/schema/patients.schema.ts";
import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import PatientServices from "../services/patients.services";

const tags = ["Patients"];

export const listPatients = os
  .route({ tags, summary: "List of Patients" })
  .output(z.array(zPatientSchema))
  .handler(async () => {
    return await db.query.patients.findMany();
  });

export const createPatient = os
  .route({ tags, summary: "Add Patient" })
  .input(z.object({ body: zCreatePatientSchema }))
  .handler(async ({ input: { body } }) => {
    const patient_no = PatientServices.genPatientNo();
    const [newPatient] = await db
      .insert(patientsTable)
      .values({
        clinic_id: body.clinic_id,
        title: body.title,
        dob: body.dob,
        gender: body.gender,
        identification_card: body.identification_card,
        name: body.name,
        patient_no: patient_no,
        address: body.address,
        email: body.email,
        emergency_contacts: body.emergency_contacts,
        contacts: body.contacts,
      })
      .returning();
    return newPatient;
  });

export const getPatientByID = os
  .route({ tags, summary: "Get Patient by ID" })
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
