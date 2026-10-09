import { z } from "zod";
import { zTimeStampSchema } from "./utils.schema";

export const zSpecialtySchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    category: z.string(),
  })
  .extend(zTimeStampSchema());
export type Specialty = z.infer<typeof zSpecialtySchema>;
