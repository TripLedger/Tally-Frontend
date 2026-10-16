"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import {
  filterCurrencies,
  type CurrencyOption,
} from "@/lib/currency";
import { useCloseBottomSheet } from "@/store";
import { useT } from "@/store/localeStore";
import { cn } from "@/lib/utils";

interface CurrencyPickerSheetProps {
  selectedCode?: string;
  onSelect: (currency: CurrencyOption) => void;
  /** Light matches current Figma profile chrome; dark is legacy sheet. */
  variant?: "light" | "dark";
}

function CurrencyRow({
  currency,
  selected,
  onSelect,
  variant,
}: {
  currency: CurrencyOption;
  selected: boolean;
  onSelect: () => void;
  variant: "light" | "dark";
}) {
  const light = variant === "light";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-14 w-full items-center gap-3 px-0",
        "transition-colors duration-150",
        light
          ? "border-b border-[#F0EEF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          : "border-b border-[#ffffff0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
      )}
    >
      <span className="text-2xl leading-none" aria-hidden>
        {currency.flag}
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <span
          className={cn(
            "text-[15px] font-semibold",
            light ? "text-[#15131A]" : "text-[#F8F8FF]"
          )}
        >
          {currency.code}
        </span>
        <span
          className={cn(
            "truncate text-[13px] font-normal",
            light ? "text-[#8E8E93]" : "text-[#94A3B8]"
          )}
        >
          {currency.name}
        </span>
      </div>
      {selected ? (
        <Check
          className="h-4 w-4 shrink-0 text-[#5921B5]"
          strokeWidth={2.5}
          aria-hidden
        />
      ) : null}
    </button>
  );
}

export function CurrencyPickerSheet({
  selectedCode,
  onSelect,
  variant = "light",
}: CurrencyPickerSheetProps) {
  const closeBottomSheet = useCloseBottomSheet();
  const t = useT();
  const [query, setQuery] = useState("");
  const light = variant === "light";

  const { common, all } = useMemo(() => filterCurrencies(query), [query]);

  const handleSelect = (currency: CurrencyOption) => {
    onSelect(currency);
    closeBottomSheet();
  };

  return (
    <div className="flex flex-col">
      <div className="relative mb-3">
        <Search
          className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
            light ? "text-[#8E8E93]" : "text-[#475569]"
          )}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.currency.search}
          autoFocus
          className={cn(
            "h-12 w-full rounded-[14px] pl-10 pr-4 text-[15px]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5]",
            light
              ? "border border-[#E8E4EF] bg-[#FAFAFA] text-[#15131A] placeholder:text-[#AEAEB2] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              : "border border-[#ffffff0f] bg-[#1C1C27] text-[#F8F8FF] placeholder:text-[#475569] focus:border-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
          )}
        />
      </div>

      <div className="max-h-[50dvh] overflow-y-auto">
        {common.length > 0 ? (
          <>
            <p
              className={cn(
                "pb-1 pt-1 text-[12px] font-semibold uppercase tracking-[0.05em]",
                light ? "text-[#8E8E93]" : "text-[#475569]"
              )}
            >
              {t.currency.common}
            </p>
            {common.map((c) => (
              <CurrencyRow
                key={`common-${c.code}`}
                currency={c}
                selected={c.code === selectedCode}
                onSelect={() => handleSelect(c)}
                variant={variant}
              />
            ))}
          </>
        ) : null}

        {all.length > 0 ? (
          <>
            <p
              className={cn(
                "pb-1 pt-3 text-[12px] font-semibold uppercase tracking-[0.05em]",
                light ? "text-[#8E8E93]" : "text-[#475569]"
              )}
            >
              {t.currency.all}
            </p>
            {all.map((c) => (
              <CurrencyRow
                key={c.code}
                currency={c}
                selected={c.code === selectedCode}
                onSelect={() => handleSelect(c)}
                variant={variant}
              />
            ))}
          </>
        ) : null}

        {common.length === 0 && all.length === 0 ? (
          <p
            className={cn(
              "py-8 text-center text-[13px]",
              light ? "text-[#8E8E93]" : "text-[#475569]"
            )}
          >
            {t.currency.empty}
          </p>
        ) : null}
      </div>
    </div>
  );
}
