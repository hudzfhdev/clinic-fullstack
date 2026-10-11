import { PRACTITIONERS_SPECIALTIES } from "#/isomorphic/constants/practitioners";
import { sql } from "drizzle-orm";
import { db } from "..";
import { specialtiesTable } from "../db.schema";

export async function seedPractitionerSpecialties() {
  try {
    await db.transaction(async (tx) => {
      for (const { fields, category } of Object.values(
        PRACTITIONERS_SPECIALTIES,
      )) {
        for (const fieldName of fields) {
          const found = await tx.query.practitioners_specialties.findFirst({
            where: {
              RAW: (table) =>
                sql`lower(${table.name}) = ${fieldName.toLowerCase()}`,
            },
          });
          if (found) {
            console.log(`found "${found.name}" in table, skipping...`);
            continue;
          }

          const pascalCaseFieldName = fieldName
            .split(" ")
            .map((name) =>
              /[A-Z]/i.test(name)
                ? name.charAt(0) + name.slice(1).toLocaleLowerCase()
                : name,
            )
            .join(" ");

          const [inserted] = await tx
            .insert(specialtiesTable)
            .values({
              name: pascalCaseFieldName,
              category,
            })
            .returning();
          console.log(`${inserted.name} has been inserted to table. next...`);
        }
      }
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedPractitionerSpecialties();
