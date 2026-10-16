import { db } from "#/db";
import { clinicsTable } from "#/db/db.schema";
import {
  zClinicCreateSchema,
  zClinicSchema,
  zUpdateClinicSchema,
} from "#/isomorphic/schema/clinics.schema.ts";
import dayjs from "#/libs/dayjs.ts";
import { ORPCError, os } from "@orpc/server";
import { eq, sql } from "drizzle-orm";
import z from "zod";

const tags = ["Clinics"];

export const createClinic = os
  .route({ tags, summary: "Add Clinic" })
  .errors({
    UNPROCESSABLE_CONTENT: {
      data: z.object({ path: z.array(z.string()) }),
    },
  })
  .input(zClinicCreateSchema)
  .handler(async ({ input }) => {
    const [start_time, end_time] = [
      dayjs(input.start_time, "HH:mm"),
      dayjs(input.end_time, "HH:mm"),
    ];
    if (!dayjs(start_time).isSameOrBefore(end_time)) {
      throw new ORPCError("UNPROCESSABLE_CONTENT", {
        message: "'Start Time' must be earlier than 'End Time'",
        data: { path: ["start_time"] },
      });
    }

    if (!dayjs(end_time).isSameOrAfter(start_time)) {
      throw new ORPCError("UNPROCESSABLE_CONTENT", {
        message: "'End time' must be later than 'Start time'",
        data: { path: ["end_time"] },
      });
    }

    const [created] = await db
      .insert(clinicsTable)
      .values({
        name: input.name,
        status: input.status,
        address: input.address,
        start_time: input.start_time,
        end_time: input.end_time,
        settings: { timezone: "GMT" },
      })
      .returning();
    return created;
  });

type ClinicFilters = NonNullable<
  Parameters<typeof db.query.clinics.findMany>[0]
>["where"];
export const listClinics = os
  .route({ tags, summary: "List of Clinics" })
  .input(
    z
      .object({ filters: zClinicSchema.pick({ status: true }) })
      .partial()
      .optional(),
  )
  .handler(async ({ input }) => {
    const where: ClinicFilters = { deleted_at: { isNull: true } };
    if (input?.filters?.status) {
      where["status"] = input.filters.status;
    }

    const listOfClinics = await db.query.clinics.findMany({
      orderBy: { created_at: "desc" },
      where,
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

export const updateClinicById = os
  .route({ tags, summary: "Update Clinic by ID", method: "PATCH" })
  .errors({
    UNPROCESSABLE_CONTENT: {
      data: z.object({ path: z.array(z.string()) }),
    },
  })
  .input(
    z.object({ params: z.object({ id: z.uuid() }), body: zUpdateClinicSchema }),
  )
  .output(zClinicSchema)
  .handler(async ({ input }) => {
    const { body, params } = input;

    const [start_time, end_time] = [
      dayjs(body.start_time, "HH:mm"),
      dayjs(body.end_time, "HH:mm"),
    ];
    if (!dayjs(start_time).isSameOrBefore(end_time)) {
      throw new ORPCError("UNPROCESSABLE_CONTENT", {
        message: "'Start Time' must be earlier than 'End Time'",
        data: { path: ["start_time"] },
      });
    }

    if (!dayjs(end_time).isSameOrAfter(start_time)) {
      throw new ORPCError("UNPROCESSABLE_CONTENT", {
        message: "'End time' must be later than 'Start time'",
        data: { path: ["end_time"] },
      });
    }

    const [updated] = await db
      .update(clinicsTable)
      .set({
        name: body.name,
        address: body.address,
        end_time: body.end_time,
        start_time: body.start_time,
        status: body.status,
      })
      .where(eq(clinicsTable.id, params.id))
      .returning();

    return updated;
  });

export const deleteClinicById = os
  .route({ tags, summary: "Soft Delete Clinic by ID", method: "DELETE" })
  .input(z.object({ id: z.uuid() }))
  .handler(async ({ input }) => {
    await db
      .update(clinicsTable)
      .set({ deleted_at: sql`now()` })
      .where(eq(clinicsTable.id, input.id));
    return { message: "clinic has been deleted." };
  });
