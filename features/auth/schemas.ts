import { z } from "zod";
import { isValidCurrencyCode } from "@/lib/currency";
import { isPasswordComplex, isResetPasswordValid } from "./passwordRules";

export const emailAuthSchema = z.object({
  email: z
    .string({ error: "Enter a valid email address" })
    .trim()
    .email("Enter a valid email address"),
});

export const signUpSchema = z
  .object({
    email: z
      .string({ error: "Enter a valid email address" })
      .trim()
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Enter a password")
      .refine(
        isPasswordComplex,
        "Use upper & lowercase, a number, and a special character"
      ),
    confirmPassword: z.string().min(1, "Repeat your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, "Enter the 6-digit code");

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Enter a password")
      .refine(isResetPasswordValid, "Choose a stronger password"),
    confirmPassword: z.string().min(1, "Repeat your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string({ error: "Enter a valid email address" })
    .trim()
    .email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const onboardingSchema = z.object({
  displayName: z
    .string()
    .min(2, "Enter a display name with at least 2 characters")
    .max(50, "Display name can't be longer than 50 characters"),
  homeCurrency: z
    .string()
    .min(1, "Select your home currency")
    .refine(isValidCurrencyCode, "Select a valid currency code"),
});

export const displayNameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Enter a display name with at least 2 characters")
    .max(50, "Display name can't be longer than 50 characters"),
});

export type EmailAuthFormData = z.infer<typeof emailAuthSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type DisplayNameFormData = z.infer<typeof displayNameSchema>;
