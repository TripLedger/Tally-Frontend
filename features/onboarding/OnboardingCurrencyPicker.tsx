"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Search } from "lucide-react";
import {
  filterCurrencies,
  type CurrencyOption,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

interface OnboardingCurrencyPickerProps {
  selectedCode?: string;
  onSelect: (currency: CurrencyOption) => void;
  onClose: () => void;
  /** Container wrapping the trigger + panel — clicks here don't close. */
  containerRef?: RefObject<HTMLElement | null>;
}

function CurrencyOptionRow({
  currency,
  selected,
  onSelect,
}: {
  currency: CurrencyOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "box-border flex h-[52px] w-full items-center gap-3 px-4 text-left text-[16px] text-[#0A0A0A]",
        "transition-colors hover:bg-[#F9FAFB]",
        selected && "bg-[#F5F3FF] font-medium"
      )}
    >
      <span className="text-xl leading-none" aria-hidden>
        {currency.flag}
      </span>
      <span>{currency.code}</span>
    </button>
  );
}

export function OnboardingCurrencyPicker({
  selectedCode,
  onSelect,
  onClose,
  containerRef,
}: OnboardingCurrencyPickerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const { common, all } = useMemo(() => filterCurrencies(query), [query]);

  const commonCodes = useMemo(() => new Set(common.map((c) => c.code)), [common]);
  const remaining = useMemo(
    () => all.filter((c) => !commonCodes.has(c.code)),
    [all, commonCodes]
  );

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef?.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [onClose, containerRef]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSelect = (currency: CurrencyOption) => {
    onSelect(currency);
    onClose();
  };

  const hasResults = common.length > 0 || remaining.length > 0;

  return (
    <div
      ref={panelRef}
      role="listbox"
      aria-label="Home currency"
      className="overflow-hidden rounded-b-2xl border border-t-0 border-[#E0E0E0] bg-white"
    >
      <div className="border-b border-[#E0E0E0] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search currency"
            autoFocus
            className={cn(
              "box-border h-[52px] w-full rounded-2xl border border-[#E0E0E0] bg-white",
              "pl-10 pr-4 text-[16px] text-[#0A0A0A] placeholder:text-[#C7C7CC]",
              "focus:border-[#9367F9] focus:outline-none focus:ring-2 focus:ring-[#9367F9]/20"
            )}
          />
        </div>
      </div>

      <div className="max-h-[min(320px,40dvh)] overflow-y-auto">
        {common.map((currency) => (
          <CurrencyOptionRow
            key={`common-${currency.code}`}
            currency={currency}
            selected={currency.code === selectedCode}
            onSelect={() => handleSelect(currency)}
          />
        ))}

        {remaining.map((currency) => (
          <CurrencyOptionRow
            key={currency.code}
            currency={currency}
            selected={currency.code === selectedCode}
            onSelect={() => handleSelect(currency)}
          />
        ))}

        {!hasResults && (
          <p className="px-4 py-8 text-center text-sm text-[#8E8E93]">
            No currencies match your search
          </p>
        )}
      </div>
    </div>
  );
}
