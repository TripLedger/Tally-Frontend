import { getPreviewGroupFriendsMembers } from "@/features/groups/mockGroupFriendsData";
import { splitEquallyMinorUnits } from "@/features/expenses/splitMath";
import { toMinorUnits } from "@/lib/currency";
import type { TripMember } from "@/types";

/** Figma split-complete frame shows four crew rows. */
const SPLIT_CREW_SIZE = 4;

export interface OutingSplitShare {
  member: TripMember;
  amountMinorUnits: number;
}

export function getOutingSplitCrew(groupId: string): TripMember[] {
  return getPreviewGroupFriendsMembers(groupId)
    .slice(0, SPLIT_CREW_SIZE)
    .map((row) => row.member);
}

export function splitOutingEqually(
  groupId: string,
  amountMajor: number,
  currency: string
): OutingSplitShare[] {
  const crew = getOutingSplitCrew(groupId);
  const totalMinor = toMinorUnits(amountMajor, currency);
  const splits = splitEquallyMinorUnits(
    totalMinor,
    crew.map((member) => member.userId)
  );

  return crew.map((member) => ({
    member,
    amountMinorUnits:
      splits.find((split) => split.userId === member.userId)
        ?.amountMinorUnits ?? 0,
  }));
}
