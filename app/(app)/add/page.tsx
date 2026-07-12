import { redirect } from "next/navigation";

/**
 * Legacy stub route. The bottom-nav FAB now goes straight to /trips/new
 * off-trip (and opens the Add Expense sheet on-trip) — anything still
 * pointing here gets forwarded.
 */
export default function AddRedirectPage() {
  redirect("/trips/new");
}
