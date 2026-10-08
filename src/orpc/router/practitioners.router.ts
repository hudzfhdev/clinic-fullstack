import { db } from "#/db/index.ts";
import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import { zPractitionerCreateSchema } from "../schema";
import { practitioners } from "#/db/db.schema.ts";
import { dv } from "@faker-js/faker";
import { eq, or, sql } from "drizzle-orm";

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
  .errors({
    UNPROCESSABLE_CONTENT: {
      data: z.object({ path: z.array(z.string()) }),
    },
  })
  .handler(async ({ input, errors }) => {
    const exist = await isEntityExist({
      identification_no: input.identification_no,
      name: input.name,
      phone_number: input.phone_number,
    });

    if (exist) {
      throw errors.UNPROCESSABLE_CONTENT({
        message: exist.errMessage,
        data: exist.errDetails,
      });
    }

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

async function isEntityExist({
  name,
  identification_no,
  phone_number,
}: {
  name: string;
  identification_no: string;
  phone_number: string;
}) {
  const foundName = await db.query.practitioners.findFirst({
    where: (col, op) =>
      op.eq(sql`lower(${col.name})`, name.toLocaleLowerCase()),
  });
  if (foundName) {
    return {
      errMessage: "Name already exist! Please double check.",
      errDetails: { path: ["name"] },
    };
  }

  const foundIC = await db.query.practitioners.findFirst({
    where: (col, op) => op.eq(col.identification_no, identification_no),
  });
  if (foundIC) {
    return {
      errMessage: "Identification Card already exist! Please double check.",
      errDetails: { path: ["identification_no"] },
    };
  }

  const foundPhone = await db.query.practitioners.findFirst({
    where: (col, op) => op.eq(col.phone_number, phone_number),
  });
  if (foundPhone) {
    return {
      errMessage: "Phone number already exist! Please double check.",
      errDetails: { path: ["phone_number"] },
    };
  }

  return null;
}
