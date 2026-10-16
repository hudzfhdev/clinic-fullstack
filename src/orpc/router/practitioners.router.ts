import { db } from "#/db/index.ts";
import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import { practitionersTable } from "#/db/db.schema.ts";
import {
  zPractitionerCreateSchema,
  zPractitionerSchema,
  zPractitionerUpdateSchema,
} from "#/isomorphic/schema/practitioners.schema.ts";
import PractitionerService from "../services/practitioners.services";
import { eq } from "drizzle-orm";

const tags = ["Practitioners"];

export const listPractitioners = os
  .route({ tags, summary: "List of Practitioners" })
  .output(z.array(zPractitionerSchema))
  .handler(async () => {
    const list = await db.query.practitioners.findMany({
      orderBy: { created_at: "desc" },
      with: { clinics: true, practitioners_specialties: true },
    });
    return list;
  });

export const getPractitionerByID = os
  .route({ tags, summary: "Get Practitioner by ID" })
  .input(z.object({ id: z.uuid() }))
  .output(zPractitionerSchema)
  .handler(async ({ input }) => {
    const practitioner = await db.query.practitioners.findFirst({
      where: { id: input.id },
    });
    if (!practitioner) {
      throw new ORPCError("NOT_FOUND", { message: "Practitioner not found." });
    }
    return practitioner;
  });

export const createPractitioner = os
  .route({ tags, summary: "Add Practitioner" })
  .input(zPractitionerCreateSchema)
  .errors({
    UNPROCESSABLE_CONTENT: {
      data: z.object({ path: z.array(z.string()) }),
    },
  })
  .handler(async ({ input, errors }) => {
    const exist = await PractitionerService.checkDuplicateIdentification({
      identification_no: input.identification_no,
    });

    if (exist) {
      throw errors.UNPROCESSABLE_CONTENT({
        message: exist.errMessage,
        data: exist.errDetails,
      });
    }

    const [newPractitioner] = await db
      .insert(practitionersTable)
      .values({
        dob: input.dob,
        gender: input.gender,
        identification_no: input.identification_no,
        name: input.name,
        phone_number: input.phone_number,
        specialty_id: input.specialty_id,
        clinic_id: input.clinic_id,
        status: input.status,
        title: input.title,
        address: input.address,
        email: input.email,
      })
      .returning();

    return newPractitioner;
  });

export const updatePractitionerById = os
  .route({ tags, summary: "Update Practitioner by ID", method: "PATCH" })
  .input(
    z.object({
      params: z.object({ id: z.uuid() }),
      body: zPractitionerUpdateSchema,
    }),
  )
  .errors({
    UNPROCESSABLE_CONTENT: {
      data: z.object({ path: z.array(z.string()) }),
    },
  })
  .handler(async ({ errors, input }) => {
    const { body, params } = input;
    const exist = await PractitionerService.checkDuplicateIdentification({
      identification_no: body.identification_no,
      id: params.id,
    });

    if (exist) {
      throw errors.UNPROCESSABLE_CONTENT({
        message: exist.errMessage,
        data: exist.errDetails,
      });
    }
    const [updated] = await db
      .update(practitionersTable)
      .set({ ...body })
      .where(eq(practitionersTable.id, params.id))
      .returning();

    return updated;
  });
