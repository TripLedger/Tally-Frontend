"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth";
import { JoinErrorState } from "@/features/trips/JoinErrorState";
import { JoinSpinner } from "@/features/trips/JoinSpinner";
import { useAddToast, useTripStore } from "@/store";

type JoinStatus = "loading" | "error";

interface JoinPageProps {
  params: { token: string };
}

export default function JoinPage({ params }: JoinPageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthSession();
  const setPendingInvite = useTripStore((s) => s.setPendingInvite);
  const joinTripViaToken = useTripStore((s) => s.joinTripViaToken);
  const addToast = useAddToast();

  const [status, setStatus] = useState<JoinStatus>("loading");

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    const token = params.token?.trim();

    if (!token) {
      setStatus("error");
      return;
    }

    (async () => {
      if (!isAuthenticated || !user) {
        setPendingInvite(token);
        if (!cancelled) router.replace("/");
        return;
      }

      if (!user.onboardingComplete) {
        setPendingInvite(token);
        if (!cancelled) router.replace("/onboarding");
        return;
      }

      try {
        const result = await joinTripViaToken(token, user);
        if (cancelled) return;

        if (!result.ok) {
          setStatus("error");
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
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    isAuthenticated,
    user,
    params.token,
    setPendingInvite,
    joinTripViaToken,
    addToast,
    router,
  ]);

  if (status === "error") {
    return (
      <div className="flex min-h-dvh flex-col bg-[#0A0A0F]">
        <JoinErrorState />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0A0A0F]">
      <JoinSpinner />
      <p className="mt-3 text-[15px] font-medium text-[#94A3B8]">
        Joining trip...
      </p>
    </div>
  );
}
