import { z } from "zod";
import { isValidCurrencyCode } from "@/lib/currency";

export const createTripSchema = z.object({
  name: z
    .string()
    .min(2, "Give your group a name with at least 2 characters")
    .max(60, "Group name is a little too long"),
  baseCurrency: z
    .string()
    .min(1, "Choose a base currency")
    .refine(isValidCurrencyCode, "Choose a valid base currency"),
});

export type CreateTripFormData = z.infer<typeof createTripSchema>;
