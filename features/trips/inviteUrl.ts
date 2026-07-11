/** Absolute shareable invite URL for a trip token. */
export function getInviteUrl(inviteToken: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/join/${inviteToken}`;
}

/** Display-friendly URL (no protocol) for the copy card. */
export function getInviteDisplayUrl(inviteToken: string): string {
  return getInviteUrl(inviteToken).replace(/^https?:\/\//, "");
}
