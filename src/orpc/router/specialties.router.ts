import { db } from "#/db";
import { practitioners_specialties } from "#/db/db.schema.ts";
import { os } from "@orpc/server";
import { sql } from "drizzle-orm";

export const listSpecialties = os.handler(async () => {
  const specialties = await db.query.practitioners_specialties.findMany();
  return specialties;
});

export const populateSpecialtiesOptions = os.handler(async () => {
  const result = await db
    .select({
      category: sql<string>`distinct(${practitioners_specialties.category})`.as(
        "category",
      ),
      fields: sql<
        Array<{ id: string; name: string }>
      >`jsonb_agg(jsonb_build_object('id', ${practitioners_specialties.id},'name',${practitioners_specialties.name}))`.as(
        "fields",
      ),
    })
    .from(practitioners_specialties)
    .groupBy(practitioners_specialties.category);
  return result;
});
