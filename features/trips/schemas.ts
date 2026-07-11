import { z } from "zod";
import { isValidCurrencyCode } from "@/lib/currency";

export const createTripSchema = z
  .object({
    name: z
      .string()
      .min(2, "Give your trip a name with at least 2 characters")
      .max(60, "Trip name is a little too long"),
    destination: z
      .string()
      .min(2, "Where are you headed? Add a destination"),
    startDate: z.string().min(1, "Pick your trip dates"),
    endDate: z.string().min(1, "Pick your trip dates"),
    baseCurrency: z
      .string()
      .min(1, "Choose a base currency")
      .refine(isValidCurrencyCode, "Choose a valid base currency"),
  })
  .refine((d) => !d.startDate || !d.endDate || d.endDate >= d.startDate, {
    path: ["endDate"],
    message: "End date can't be before the start date",
  });

export type CreateTripFormData = z.infer<typeof createTripSchema>;
