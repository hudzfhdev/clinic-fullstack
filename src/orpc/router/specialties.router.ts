import { db } from "#/db";
import { os } from "@orpc/server";

export const listSpecialties = os.handler(async () => {
  const specialties = await db.query.practitioner_specialties.findMany();
  return specialties;
});
