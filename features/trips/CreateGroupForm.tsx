"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import {
  AuthBackButton,
  AuthBody,
  AuthField,
  AuthPrimaryButton,
  AuthStackHeader,
  AuthStackScreen,
  useAuthSession,
} from "@/features/auth";
import { HomeProfileAvatarLink } from "@/features/home";
import { OnboardingCurrencyPicker } from "@/features/onboarding";
import { createTripSchema, type CreateTripFormData } from "@/features/trips/schemas";
import { getCurrencyByCode } from "@/lib/currency";
import { useAddToast, useTripStore } from "@/store";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/** Figma create-group input — 40px pill, #E5E5E5, shadow-xs */
const groupFieldClass = cn(
  "flex min-h-[40px] w-full items-center gap-3 self-stretch",
  "rounded-full border border-[#E5E5E5] bg-white px-4 py-[9.5px]",
  "text-[16px] font-normal leading-none text-[#15131A]",
  "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  "appearance-none outline-none",
  "placeholder:font-normal placeholder:text-[#C7C7CC]",
  "focus:border-[#9367F9] focus:outline-none focus:ring-2 focus:ring-[#9367F9]/20"
);

export function CreateGroupForm() {
  const router = useRouter();
  const { user } = useAuthSession();
  const createTrip = useTripStore((s) => s.createTrip);
  const addToast = useAddToast();
  const [submitting, setSubmitting] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyFieldRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      baseCurrency: "",
    },
  });

  const baseCurrency = watch("baseCurrency");
  const selectedCurrency = baseCurrency
    ? getCurrencyByCode(baseCurrency)
    : undefined;

  const onSubmit = async (data: CreateTripFormData) => {
    if (!user) {
      addToast({ message: "You need to be signed in.", variant: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const trip = await createTrip(
        {
          name: data.name,
          destination: "",
          startDate: "",
          endDate: "",
          baseCurrency: data.baseCurrency,
        },
        user
      );
      router.push(`/dashboard?created=${trip.id}`);
    } catch {
      setSubmitting(false);
      addToast({
        message: "Couldn't create the group. Please try again.",
        variant: "error",
      });
    }
  };

  const enabled = isValid && !submitting;

  return (
    <AuthStackScreen>
      <div className="flex items-center justify-between">
        <AuthBackButton href="/dashboard" label="Back to home" />
        <HomeProfileAvatarLink avatarUrl={user?.avatarUrl} />
      </div>

      <AuthStackHeader
        title="Create group"
        subtitle="Start building experiences with your crew"
      />

      <AuthBody className="flex-1">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full min-w-0 flex-1 flex-col"
        >
          <div className="flex w-full min-w-0 flex-col gap-6">
            <AuthField
              label="Group name"
              htmlFor="group-name"
              error={errors.name?.message}
            >
              <input
                id="group-name"
                autoComplete="off"
                autoFocus
                placeholder="Display name"
                className={cn(
                  groupFieldClass,
                  errors.name && "border-[#F43F5E]",
                  focusRing
                )}
                {...register("name")}
              />
            </AuthField>

            <div ref={currencyFieldRef} className="relative w-full min-w-0">
              <AuthField
                label="Base currency"
                htmlFor="baseCurrency"
                error={errors.baseCurrency?.message}
              >
                <Controller
                  name="baseCurrency"
                  control={control}
                  render={() => (
                    <button
                      type="button"
                      id="baseCurrency"
                      aria-haspopup="listbox"
                      aria-expanded={currencyOpen}
                      onClick={() => setCurrencyOpen((open) => !open)}
                      className={cn(
                        groupFieldClass,
                        "justify-between text-left",
                        errors.baseCurrency && "border-[#F43F5E]",
                        focusRing
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-3 text-[16px] leading-none",
                          selectedCurrency ? "text-[#15131A]" : "text-[#C7C7CC]"
                        )}
                      >
                        {selectedCurrency ? (
                          <>
                            <span className="text-xl leading-none" aria-hidden>
                              {selectedCurrency.flag}
                            </span>
                            <span>{selectedCurrency.code}</span>
                          </>
                        ) : (
                          "Select currency"
                        )}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 text-[#8E8E93] transition-transform",
                          currencyOpen && "rotate-180"
                        )}
                        strokeWidth={1.75}
                      />
                    </button>
                  )}
                />
              </AuthField>

              {currencyOpen ? (
                <OnboardingCurrencyPicker
                  selectedCode={baseCurrency}
                  containerRef={currencyFieldRef}
                  onSelect={(currency) =>
                    setValue("baseCurrency", currency.code, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  onClose={() => setCurrencyOpen(false)}
                  className="mt-2 rounded-2xl border border-[#E5E5E5] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-auto pt-16">
            <AuthPrimaryButton
              variant="stack"
              enabled={enabled}
              disabled={!enabled}
            >
              {submitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Create"
              )}
            </AuthPrimaryButton>
          </div>
        </form>
      </AuthBody>
    </AuthStackScreen>
  );
}
