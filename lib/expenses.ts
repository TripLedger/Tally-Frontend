import type { ExpenseSplit } from "@/types";

export interface LineItemShare {
  userId: string;
  /** Integer minor units of this line item owed by the member. */
  share: number;
}

export interface LineItemWithSplit {
  name: string;
  quantity: number;
  lineTotal: number;
  splitMap: LineItemShare[];
}

/** Equal shares of a line total; remainder distributed one unit at a time. */
export function equalShareSplitMap(
  lineTotal: number,
  userIds: string[]
): LineItemShare[] {
  if (userIds.length === 0 || lineTotal <= 0) return [];

  const base = Math.floor(lineTotal / userIds.length);
  let remainder = lineTotal - base * userIds.length;

  return userIds.map((userId) => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    return { userId, share: base + extra };
  });
}

/**
 * Derive the top-level expense splitMap from per-line-item shares.
 * Shape matches manually entered custom splits so balance math is unchanged.
 */
export function deriveSplitsFromLineItems(
  lineItems: LineItemWithSplit[],
  memberIds: string[]
): ExpenseSplit[] {
  return memberIds
    .map((userId) => ({
      userId,
      amountMinorUnits: lineItems.reduce((sum, item) => {
        const entry = item.splitMap.find((s) => s.userId === userId);
        return sum + (entry?.share ?? 0);
      }, 0),
    }))
    .filter((s) => s.amountMinorUnits > 0);
}

/** True when shares are present and sum exactly to the line total (minor units). */
export function isLineItemFullyAssigned(item: LineItemWithSplit): boolean {
  if (item.splitMap.length === 0) return false;
  const sum = item.splitMap.reduce((acc, s) => acc + s.share, 0);
  return sum === item.lineTotal;
}

export function sumUnassignedLineItems(items: LineItemWithSplit[]): number {
  return items.reduce((sum, item) => {
    if (isLineItemFullyAssigned(item)) return sum;
    return sum + item.lineTotal;
  }, 0);
}
