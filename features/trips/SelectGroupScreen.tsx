"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthBackButton,
  AuthStackHeader,
  useAuthSession,
} from "@/features/auth";
import { HomeProfileAvatarLink } from "@/features/home";
import { cn } from "@/lib/utils";
import { SelectGroupCard } from "./SelectGroupCard";
import {
  MOCK_SELECT_GROUPS,
  filterSelectGroups,
  type SelectGroupView,
} from "./mockSelectGroups";

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

interface SelectGroupScreenProps {
  groupId: string;
  placeId: string;
}

/**
 * Add-trip flow — “Who’s coming?” pick a group for this place.
 * Covers from public/tabr/home/images/card images (mock until API).
 */
export function SelectGroupScreen({
  groupId,
  placeId,
}: SelectGroupScreenProps) {
  const router = useRouter();
  const { user } = useAuthSession();
  const [query, setQuery] = useState("");

  const groups = useMemo(
    () => filterSelectGroups(MOCK_SELECT_GROUPS, query),
    [query]
  );

  const onSelect = (group: SelectGroupView) => {
    router.push(
      `/trips/${groupId}/trips/new/${placeId}/customise?group=${encodeURIComponent(group.id)}`
    );
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(1.5rem,var(--safe-bottom))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center justify-between">
        <AuthBackButton
          href={`/trips/${groupId}/trips/new/${placeId}`}
          label="Back to location"
        />
        <HomeProfileAvatarLink avatarUrl={user?.avatarUrl} />
      </div>

      <AuthStackHeader
        title="Who’s coming?"
        subtitle="Choose a group to plan this trip with"
      />

      <div
        className={cn(
          "mt-5 flex h-11 w-full shrink-0 items-center gap-2",
          "rounded-full bg-[#F5F5F5] px-3.5",
          "ring-1 ring-[#EFEFEF]"
        )}
        role="search"
      >
        <label className="flex min-w-0 flex-1 items-center gap-2">
          <span className="sr-only">Search groups</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tabr/home/icons/search.svg"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={cn(
              "min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-5",
              "text-[#15131A] placeholder:text-[#8E8E93]",
              "appearance-none outline-none"
            )}
          />
        </label>
      </div>

      <h2 className="text-tabr-ink-paragraph-medium mt-6 shrink-0">
        Your groups
      </h2>

      <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-2">
        {groups.length === 0 ? (
          <li className="py-10 text-center text-[14px] text-[#716D7D]">
            No groups match that search.
          </li>
        ) : (
          groups.map((group) => (
            <li key={group.id} className="w-full shrink-0">
              <SelectGroupCard group={group} onSelect={onSelect} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
