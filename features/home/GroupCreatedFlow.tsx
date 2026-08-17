"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GroupCreatedOverlay } from "./GroupCreatedOverlay";
import { ShareWithFriendsOverlay } from "./ShareWithFriendsOverlay";
import { MOCK_EXISTING_HOME_TRIP } from "./mockExistingHomeData";
import { useTrips } from "@/store";

type FlowStep = "success" | "share" | null;

export function GroupCreatedFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewCreated = searchParams.get("preview") === "created";
  const createdTripId =
    searchParams.get("created") ??
    (previewCreated ? MOCK_EXISTING_HOME_TRIP.id : null);
  const trips = useTrips();
  const [step, setStep] = useState<FlowStep>(null);

  const trip = createdTripId
    ? trips.find((entry) => entry.id === createdTripId) ??
      (previewCreated || createdTripId === MOCK_EXISTING_HOME_TRIP.id
        ? MOCK_EXISTING_HOME_TRIP
        : null)
    : null;

  useEffect(() => {
    if (!createdTripId) {
      setStep(null);
      return;
    }
    setStep("success");
  }, [createdTripId]);

  const clearCreatedParam = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("created");
    if (params.get("preview") === "created") {
      params.set("preview", "existing");
    }
    const query = params.toString();
    router.replace(query ? `/dashboard?${query}` : "/dashboard", {
      scroll: false,
    });
    setStep(null);
  }, [router, searchParams]);

  const handleInviteFriends = () => {
    setStep("share");
  };

  const handleCloseShare = () => {
    clearCreatedParam();
  };

  const handleCloseSuccess = () => {
    clearCreatedParam();
  };

  if (!createdTripId || !trip) return null;

  return (
    <>
      <GroupCreatedOverlay
        open={step === "success"}
        onInviteFriends={handleInviteFriends}
        onClose={handleCloseSuccess}
      />
      <ShareWithFriendsOverlay
        open={step === "share"}
        inviteToken={trip.inviteToken}
        tripName={trip.name}
        onClose={handleCloseShare}
      />
    </>
  );
}
