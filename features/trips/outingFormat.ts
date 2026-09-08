/**
 * Display helpers for created outing details (Figma: Coffee date).
 */

/** “Thursday, September 9” */
export function formatOutingWeekdayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${month} ${d}`;
}

/** “8:00PM” from “20:00” / “8:00” */
export function formatOutingTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;
  let hours = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hours) || hours > 23) return time;
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes}${suffix}`;
}

/** Figma placeholder address until places API returns one. */
export const MOCK_PLACE_ADDRESSES: Record<string, string> = {
  "cafe-alyanto":
    "Flowershop Cafe, Store 2:, 274 Akin Adesola St, Victoria Island, Lagos 106104, Lagos",
};

export function getPlaceAddress(placeId: string, fallbackLocation: string): string {
  return (
    MOCK_PLACE_ADDRESSES[placeId] ??
    `${fallbackLocation}, Lagos`
  );
}
