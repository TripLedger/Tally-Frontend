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

/** Add-trip customise form (Figma: Customise your trip). */
export const customiseTripSchema = z.object({
  name: z
    .string()
    .min(2, "Give your trip a name with at least 2 characters")
    .max(60, "Trip name is a little too long"),
  groupId: z.string().min(1, "Choose a group"),
  location: z
    .string()
    .min(2, "Add a location")
    .max(80, "Location is a little too long"),
  date: z.string().min(1, "Pick a date"),
  time: z
    .string()
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, "Use a time like 10:30"),
});

export type CustomiseTripFormData = z.infer<typeof customiseTripSchema>;
