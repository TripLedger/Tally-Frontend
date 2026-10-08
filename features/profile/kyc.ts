import type { AuthKycStatus } from "@/store/authStore";

/** KYC verification phases — backend owns the real status; UI maps it to color. */
export type KycStatus = AuthKycStatus;

export const KYC_STATUS_LABEL: Record<KycStatus, string> = {
  pending: "Pending",
  failed: "Failed",
  verified: "Verified",
};

/** Figma: Pending amber, Failed red, Verified green. */
export const KYC_STATUS_COLOR: Record<KycStatus, string> = {
  pending: "#F59E0B",
  failed: "#F43F5E",
  verified: "#22C55E",
};

export function normalizeKycStatus(value: unknown): KycStatus {
  if (value === "failed" || value === "verified" || value === "pending") {
    return value;
  }
  return "pending";
}
