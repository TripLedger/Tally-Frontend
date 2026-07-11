"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import {
  filterCurrencies,
  type CurrencyOption,
} from "@/lib/currency";
import { useCloseBottomSheet } from "@/store";
import { cn } from "@/lib/utils";

interface CurrencyPickerSheetProps {
  selectedCode?: string;
  onSelect: (currency: CurrencyOption) => void;
}

function CurrencyRow({
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
      onClick={onSelect}
      className={cn(
        "flex h-14 w-full items-center gap-3 border-b border-[#ffffff0f] px-0",
        "transition-colors duration-fast ease-tally",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
      )}
    >
      <span className="text-2xl leading-none">{currency.flag}</span>
      <div className="flex flex-1 flex-col items-start">
        <span className="text-[15px] font-semibold text-[#F8F8FF]">
          {currency.code}
        </span>
        <span className="text-[13px] font-normal text-[#94A3B8]">
          {currency.name}
        </span>
      </div>
      {selected && (
        <Check className="h-4 w-4 shrink-0 text-[#7C3AED]" strokeWidth={2.5} />
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-8 items-end pb-1 pl-0">
      <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#475569]">
        {children}
      </span>
    </div>
  );
}

export function CurrencyPickerSheet({
  selectedCode,
  onSelect,
}: CurrencyPickerSheetProps) {
  const closeBottomSheet = useCloseBottomSheet();
  const [query, setQuery] = useState("");

  const { common, all } = useMemo(() => filterCurrencies(query), [query]);

  const handleSelect = (currency: CurrencyOption) => {
    onSelect(currency);
    closeBottomSheet();
  };

  return (
    <div className="flex flex-col">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search currency"
          autoFocus
          className={cn(
            "h-12 w-full rounded-[10px] bg-[#1C1C27] pl-10 pr-4",
            "text-[15px] text-[#F8F8FF] placeholder:text-[#475569]",
            "border border-[#ffffff0f] focus:border-[#7C3AED] focus:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
          )}
        />
      </div>

      <div className="max-h-[50dvh] overflow-y-auto">
        {common.length > 0 && (
          <>
            <SectionLabel>Common</SectionLabel>
            {common.map((c) => (
              <CurrencyRow
                key={`common-${c.code}`}
                currency={c}
                selected={c.code === selectedCode}
                onSelect={() => handleSelect(c)}
              />
            ))}
          </>
        )}

        {all.length > 0 && (
          <>
            <SectionLabel>All currencies</SectionLabel>
            {all.map((c) => (
              <CurrencyRow
                key={c.code}
                currency={c}
                selected={c.code === selectedCode}
                onSelect={() => handleSelect(c)}
              />
            ))}
          </>
        )}

        {common.length === 0 && all.length === 0 && (
          <p className="py-8 text-center text-[13px] text-[#475569]">
            No currencies match your search
          </p>
        )}
      </div>
    </div>
  );
}
