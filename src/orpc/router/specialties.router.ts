import { db } from "#/db";
import { specialtiesTable } from "#/db/db.schema.ts";
import { os } from "@orpc/server";
import { sql } from "drizzle-orm";

const tags = ["Specialties"];

export const listSpecialties = os
  .route({ tags, summary: "List of Specialties" })
  .handler(async () => {
    const specialties = await db.query.practitioners_specialties.findMany();
    return specialties;
  });

export const populateSpecialtiesOptions = os
  .route({ tags, summary: "Grouped Specialties by Category" })
  .handler(async () => {
    const result = await db
      .select({
        category: sql<string>`distinct(${specialtiesTable.category})`.as(
          "category",
        ),
        fields: sql<
          Array<{ id: string; name: string }>
        >`jsonb_agg(jsonb_build_object('id', ${specialtiesTable.id},'name',${specialtiesTable.name}))`.as(
          "fields",
        ),
      })
      .from(specialtiesTable)
      .groupBy(specialtiesTable.category)
      .orderBy(sql`${specialtiesTable.category} asc`);
    return result;
  });
