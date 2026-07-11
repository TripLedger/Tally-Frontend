"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, ChevronDown, ChevronLeft } from "lucide-react";
import { CurrencyPickerSheet, useAuthSession } from "@/features/auth";
import {
  DateRangePickerSheet,
  createTripSchema,
  type CreateTripFormData,
} from "@/features/trips";
import { getCurrencyByCode } from "@/lib/currency";
import { formatDateRange, cn } from "@/lib/utils";
import { useTripStore, useOpenBottomSheet, useAddToast } from "@/store";

export default function NewTripPage() {
  const router = useRouter();
  const { user } = useAuthSession();
  const createTrip = useTripStore((s) => s.createTrip);
  const openBottomSheet = useOpenBottomSheet();
  const addToast = useAddToast();

  const [submitting, setSubmitting] = useState(false);
  const [exiting, setExiting] = useState(false);

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
      destination: "",
      startDate: "",
      endDate: "",
      baseCurrency: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const baseCurrency = watch("baseCurrency");
  const selectedCurrency = baseCurrency
    ? getCurrencyByCode(baseCurrency)
    : undefined;

  const openDatePicker = () => {
    openBottomSheet(
      <DateRangePickerSheet
        startDate={startDate}
        endDate={endDate}
        onSelect={({ startDate: s, endDate: e }) => {
          setValue("startDate", s, { shouldValidate: true, shouldDirty: true });
          setValue("endDate", e, { shouldValidate: true, shouldDirty: true });
        }}
      />,
      { title: "Select dates", height: "75" }
    );
  };

  const openCurrencyPicker = () => {
    openBottomSheet(
      <CurrencyPickerSheet
        selectedCode={baseCurrency}
        onSelect={(c) =>
          setValue("baseCurrency", c.code, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />,
      { height: "75" }
    );
  };

  const onSubmit = async (data: CreateTripFormData) => {
    if (!user) {
      addToast({ message: "You need to be signed in.", variant: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const trip = await createTrip(data, user);
      setExiting(true);
      await new Promise((r) => setTimeout(r, 250));
      router.push(`/trips/${trip.id}/invite?from=create`);
    } catch {
      setSubmitting(false);
      addToast({
        message: "Couldn't create the trip. Please try again.",
        variant: "error",
      });
    }
  };

  const inputClasses = (hasError: boolean) =>
    cn(
      "h-14 w-full rounded-[12px] bg-[#13131A] px-4",
      "text-[18px] font-medium text-[#F8F8FF] placeholder:text-[#475569]",
      "border transition-all duration-default ease-tally",
      "focus:border-[#7C3AED] focus:border-[1.5px] focus:outline-none",
      "focus:shadow-[0_0_0_4px_#7C3AED1a]",
      "focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
      hasError ? "border-[#F43F5E]" : "border-[#ffffff0f]"
    );

  const labelClasses = "mb-1.5 block text-[13px] font-medium text-[#94A3B8]";

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col bg-[#0A0A0F]",
        exiting && "animate-slide-out-left"
      )}
    >
      {/* Sticky header (y:0–64) */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#ffffff0f] bg-[#0A0A0F] safe-top">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#F8F8FF] transition-colors hover:bg-[#1C1C27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ml-[8px]"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold text-[#F8F8FF]">
          New trip
        </h1>
      </header>

      {/* Form zone */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-5 px-6 pb-[120px] pt-6"
      >
        {/* Field 1 — Trip name */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Trip name
          </label>
          <input
            id="name"
            {...register("name")}
            placeholder="e.g. Lagos Getaway"
            className={inputClasses(Boolean(errors.name))}
          />
          {errors.name && (
            <p className="mt-1.5 text-[13px] text-[#F43F5E]">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Field 2 — Destination */}
        <div>
          <label htmlFor="destination" className={labelClasses}>
            Destination
          </label>
          <input
            id="destination"
            {...register("destination")}
            placeholder="e.g. Lagos, Nigeria"
            className={inputClasses(Boolean(errors.destination))}
          />
          {errors.destination && (
            <p className="mt-1.5 text-[13px] text-[#F43F5E]">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Field 3 — Dates */}
        <div>
          <label htmlFor="dates" className={labelClasses}>
            Dates
          </label>
          <Controller
            name="endDate"
            control={control}
            render={() => (
              <button
                type="button"
                id="dates"
                onClick={openDatePicker}
                className={cn(
                  "flex h-14 w-full items-center justify-between rounded-[12px] bg-[#13131A] px-4",
                  "border transition-all duration-default ease-tally",
                  "focus:border-[#7C3AED] focus:border-[1.5px] focus:outline-none",
                  "focus:shadow-[0_0_0_4px_#7C3AED1a]",
                  "focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
                  errors.endDate ? "border-[#F43F5E]" : "border-[#ffffff0f]"
                )}
              >
                <span className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#94A3B8]" />
                  {startDate && endDate ? (
                    <span className="text-[16px] font-semibold text-[#F8F8FF] tabular-nums">
                      {formatDateRange(startDate, endDate)}
                    </span>
                  ) : (
                    <span className="text-[18px] font-medium text-[#475569]">
                      Select dates
                    </span>
                  )}
                </span>
                <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
              </button>
            )}
          />
          {errors.endDate && (
            <p className="mt-1.5 text-[13px] text-[#F43F5E]">
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Field 4 — Base currency */}
        <div>
          <label htmlFor="baseCurrency" className={labelClasses}>
            Base currency
          </label>
          <Controller
            name="baseCurrency"
            control={control}
            render={() => (
              <button
                type="button"
                id="baseCurrency"
                onClick={openCurrencyPicker}
                className={cn(
                  "flex h-14 w-full items-center justify-between rounded-[12px] bg-[#13131A] px-4",
                  "border transition-all duration-default ease-tally",
                  "focus:border-[#7C3AED] focus:border-[1.5px] focus:outline-none",
                  "focus:shadow-[0_0_0_4px_#7C3AED1a]",
                  "focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
                  errors.baseCurrency ? "border-[#F43F5E]" : "border-[#ffffff0f]"
                )}
              >
                {selectedCurrency ? (
                  <span className="text-[16px] font-semibold text-[#F8F8FF]">
                    {selectedCurrency.flag} {selectedCurrency.code} ·{" "}
                    {selectedCurrency.name}
                  </span>
                ) : (
                  <span className="text-[18px] font-medium text-[#475569]">
                    Select currency
                  </span>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 text-[#94A3B8]" />
              </button>
            )}
          />
          <p className="mt-2 max-w-[340px] text-[13px] leading-[1.4] text-[#475569]">
            All expenses in this trip will convert to this currency for the
            group ledger.
          </p>
          {errors.baseCurrency && (
            <p className="mt-1.5 text-[13px] text-[#F43F5E]">
              {errors.baseCurrency.message}
            </p>
          )}
        </div>
      </form>

      {/* Pinned CTA — full width inside padded container, not edge-to-edge */}
      <div className="fixed bottom-6 left-0 right-0 z-20 mx-auto w-full max-w-mobile px-6 safe-bottom">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || submitting}
          className={cn(
            "relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[12px]",
            "text-[16px] font-semibold transition-all duration-default ease-tally",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
            isValid || submitting
              ? "bg-accent-gradient text-[#F8F8FF] shadow-[0_4px_20px_#7C3AED40]"
              : "bg-[#1C1C27] text-[#475569] shadow-none"
          )}
        >
          <span
            className={cn(
              "transition-opacity duration-fast",
              submitting ? "opacity-0" : "opacity-100"
            )}
          >
            Create trip
          </span>
          {submitting && (
            <span
              className="absolute h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white"
              style={{ animationDuration: "800ms" }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
