import { db } from "#/db/index.ts";

export class ClinicServices {
  static async listClinics(props?: { filter?: Partial<{ id: string }> }) {
    const { filter } = props ?? {};
    return await db.query.clinics.findMany({
      where: filter ? { id: filter.id } : {},
    });
  }

  static async findByID({ id }: { id: string }) {
    return await db.query.clinics.findFirst({ where: { id } });
  }
}
