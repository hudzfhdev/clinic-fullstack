import { z } from "zod";

export const zAddressSchema = () =>
  z.object({
    address_one: z.string().min(1),
    address_two: z.string().optional(),
    city: z.string().min(1),
    postcode: z.string().min(1),
    state: z.string().min(1),
  });

export const zTimeStampSchema = () => ({
  created_at: z.string(),
  updated_at: z.string(),
});
