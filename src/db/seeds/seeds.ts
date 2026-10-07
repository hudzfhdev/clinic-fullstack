import { PRACTITIONERS_SPECIALTIES } from "#/isomorphic/constants/practitioners";
import { db } from "..";
import { practitioners_specialties } from "../db.schema";

export async function seedPractitionerSpecialties() {
  try {
    await db.transaction(async (tx) => {
      for (const { fields, category } of Object.values(
        PRACTITIONERS_SPECIALTIES,
      )) {
        for (const fieldName of fields) {
          const found = await tx.query.practitioners_specialties.findFirst({
            where: (col, op) => op.eq(col.name, fieldName),
          });
          if (found) {
            console.log(`found "${found.name}" in table, skipping...`);
            continue;
          }
          const [inserted] = await tx
            .insert(practitioners_specialties)
            .values({
              name: fieldName,
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
