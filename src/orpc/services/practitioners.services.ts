import { db } from "#/db/index.ts";

class PractitionerService {
  static async checkDuplicateIdentification({
    identification_no,
    id,
  }: {
    identification_no: string;
    id?: string;
  }) {
    const foundIC = await db.query.practitioners.findFirst({
      where: { identification_no, id: { ne: id } },
      columns: { identification_no: true },
    });

    if (foundIC?.identification_no) {
      return {
        errMessage:
          "Same identification card already exist! Please double check.",
        errDetails: { path: ["identification_no"] },
      };
    }

    return null;
  }
}

export default PractitionerService;
