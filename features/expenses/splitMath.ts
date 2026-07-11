import type { ExpenseSplit } from "@/types";

/** Split total minor units equally; remainder distributed one unit at a time. */
export function splitEquallyMinorUnits(
  totalMinor: number,
  userIds: string[]
): ExpenseSplit[] {
  if (userIds.length === 0 || totalMinor <= 0) return [];

  const base = Math.floor(totalMinor / userIds.length);
  let remainder = totalMinor - base * userIds.length;

  return userIds.map((userId) => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    return { userId, amountMinorUnits: base + extra };
  });
}

export function sumSplitMinorUnits(splits: ExpenseSplit[]): number {
  return splits.reduce((sum, s) => sum + s.amountMinorUnits, 0);
}

export function isCustomSplitExact(
  totalMinor: number,
  splits: ExpenseSplit[]
): boolean {
  return totalMinor > 0 && sumSplitMinorUnits(splits) === totalMinor;
}

export function getCustomSplitDelta(
  totalMinor: number,
  splits: ExpenseSplit[]
): number {
  return totalMinor - sumSplitMinorUnits(splits);
}
