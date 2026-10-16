import { redirect } from "next/navigation";

/** App entry → splash, then onboarding / home after one full logo spin. */
export default function HomePage() {
  redirect("/splash");
}
