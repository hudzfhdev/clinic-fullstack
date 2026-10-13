import { servicesTable } from "#/db/db.schema.ts";
import { db } from "#/db/index.ts";
import {
  zCreateServiceSchema,
  zServiceSchema,
} from "#/isomorphic/schema/services.schema.ts";
import { ORPCError, os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ClinicServices } from "../services/clinics.services";

const tags = ["Services"];

export const createService = os
  .route({ tags, summary: "Add Service" })
  .input(zCreateServiceSchema)
  .handler(async ({ input }) => {
    const [created] = await db
      .insert(servicesTable)
      .values({
        name: input.name,
        description: input.description,
        clinic_id: input.clinic_id,
      })
      .returning();
    return created;
  });

export const listServices = os
  .route({ tags, summary: "List of Services" })
  .output(z.array(zServiceSchema))
  .input(
    z
      .object({ filter: z.object({ clinic_id: z.uuid() }) })
      .partial()
      .optional(),
  )
  .handler(async ({ input }) => {
    const checkClinic = await ClinicServices.findByID({
      id: input?.filter?.clinic_id,
    });
    if (!checkClinic) {
      throw new ORPCError("NOT_FOUND", {
        message: "clinic id does not exist.",
      });
    }

    const services = await db.query.services.findMany({
      with: { clinic: true },
      where: input?.filter
        ? { AND: [{ clinic_id: input.filter.clinic_id }] }
        : {},
    });
    return services;
  });

export const deleteServiceById = os
  .route({ method: "DELETE", tags, summary: "Delete Service by ID" })
  .input(z.object({ id: z.uuid() }))
  .handler(async ({ input }) => {
    await db.delete(servicesTable).where(eq(servicesTable.id, input.id));
    return { message: "Successfully deleted service data." };
  });
