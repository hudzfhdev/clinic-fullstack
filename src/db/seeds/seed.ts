import { PRACTITIONER_SPECIALTIES } from "#/isomorphic/constants/practitioners";
import { db } from "..";
import { practitioner_specialties } from "../db.schema";

export async function seedPractitionerSpecialties() {
  try {
    await db.transaction(async (tx) => {
      for (const [k, v] of Object.entries(PRACTITIONER_SPECIALTIES)) {
        console.log(`inserting ${k} into table...`);
        const res = await tx.insert(practitioner_specialties).values({
          name: v.name,
          fields: v.fields,
        });
        if (res.rowCount) {
          console.log(`${k} has been inserted into table...`);
        }
      }
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  } finally {
    process.exit(1);
  }
}

seedPractitionerSpecialties();
