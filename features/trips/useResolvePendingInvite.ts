"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useAddToast,
  usePendingInvite,
  useTripStore,
  useUser,
} from "@/store";
import { useAuthStore } from "@/store/authStore";

/**
 * After auth + onboarding, auto-join any trip saved from a logged-out invite link.
 * Call once from the authenticated app layout.
 */
export function useResolvePendingInvite() {
  const router = useRouter();
  const user = useUser();
  const pendingToken = usePendingInvite();
  const joinTripViaToken = useTripStore((s) => s.joinTripViaToken);
  const clearPendingInvite = useTripStore((s) => s.clearPendingInvite);
  const addToast = useAddToast();
  const inFlightRef = useRef(false);

  const userId = user?.id;
  const onboardingComplete = user?.onboardingComplete ?? false;

  useEffect(() => {
    if (!userId || !onboardingComplete || !pendingToken) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    let cancelled = false;

    (async () => {
      const token = pendingToken;
      const authUser = useAuthStore.getState().user;
      if (!authUser || authUser.id !== userId) return;

      try {
        const result = await joinTripViaToken(token, authUser);
        if (cancelled) return;

        clearPendingInvite();

        if (!result.ok) {
          addToast({
            message:
              "This invite link isn't valid. Ask your trip organizer for a new one.",
            variant: "error",
          });
          return;
        }

        if (result.isNewMember) {
          addToast({
            message: `You joined ${result.trip.name}`,
            variant: "success",
          });
        }

        router.replace(`/trips/${result.trip.id}`);
      } catch {
        if (cancelled) return;
        clearPendingInvite();
        addToast({
          message: "Couldn't join the trip. Please try again.",
          variant: "error",
        });
      } finally {
        if (!cancelled) inFlightRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
      inFlightRef.current = false;
    };
  }, [
    userId,
    onboardingComplete,
    pendingToken,
    joinTripViaToken,
    clearPendingInvite,
    addToast,
    router,
  ]);
}

export function PendingInviteResolver() {
  useResolvePendingInvite();
  return null;
}
