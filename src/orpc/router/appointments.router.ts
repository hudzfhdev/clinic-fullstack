import { zCreateAppointmentSchema } from "#/isomorphic/schema/appointment.schema.ts";
import { os } from "@orpc/server";

export const createAppointment = os
  .input(zCreateAppointmentSchema)
  .handler(async ({ input }) => {
    return {};
  });
