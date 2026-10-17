import { appointmentsTable } from "#/db/db.schema.ts";
import { db } from "#/db/index.ts";
import {
  zAppointmentSchema,
  zCreateAppointmentSchema,
} from "#/isomorphic/schema/appointment.schema.ts";
import { os } from "@orpc/server";
import { z } from "zod";

const tags = ["Appointments"];

export const listAppointments = os
  .route({ tags, summary: "List of Appointments" })
  .output(z.array(zAppointmentSchema))
  .handler(async () => {
    return await db.query.appointments.findMany();
  });

export const createAppointment = os
  .route({ tags, summary: "Create Appointment" })
  .input(z.object({ body: zCreateAppointmentSchema }))
  .handler(async ({ input: { body } }) => {
    const [created] = await db
      .insert(appointmentsTable)
      .values({
        clinic_id: body.clinic_id,
        duration: "",
        end_time: body.start_time,
        patient_id: body.patient_id,
        practitioner_id: body.practitioner_id,
        room_id: body.room_id,
        service_id: body.service_id,
        start_time: body.start_time,
        status: body.status,
      })
      .returning();
    return created;
  });
