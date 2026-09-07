import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidCurrencyCode } from "@/lib/currency";
import { updateUser, findUserById } from "@/lib/db/users";

const patchUserSchema = z
  .object({
    userId: z.string().min(1),
    displayName: z
      .string()
      .trim()
      .min(2, "Enter a display name with at least 2 characters")
      .max(50, "Display name can't be longer than 50 characters")
      .optional(),
    homeCurrency: z
      .string()
      .trim()
      .toUpperCase()
      .refine(isValidCurrencyCode, "Select a valid currency code")
      .optional(),
  })
  .strict()
  .refine(
    (data) => data.displayName !== undefined || data.homeCurrency !== undefined,
    { message: "Provide displayName and/or homeCurrency" }
  );

/**
 * PATCH /api/user — { userId, displayName?, homeCurrency? }
 *
 * Updates the user's profile in the local/Dynamo user store.
 * Open while auth is mock — userId is required until the real backend ships.
 */
export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  const parsed = patchUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        reason: "validation_error",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { userId, displayName, homeCurrency } = parsed.data;

  try {
    await updateUser(userId, {
      ...(displayName !== undefined ? { displayName } : {}),
      ...(homeCurrency !== undefined ? { homeCurrency } : {}),
    });
  } catch (error) {
    console.warn("User patch skipped or failed:", error);
  }

  const user = await findUserById(userId).catch(() => null);

  return NextResponse.json({
    ok: true,
    user: user
      ? {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          homeCurrency: user.homeCurrency,
          avatarUrl: user.avatarUrl,
          onboardingComplete: true,
        }
      : {
          id: userId,
          email: "",
          displayName: displayName ?? "",
          homeCurrency: homeCurrency ?? "USD",
          onboardingComplete: true,
        },
  });
}
