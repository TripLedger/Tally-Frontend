import { emitSettlementConfirmedNotifications } from "@/lib/notifications/emit";
import { generateId } from "@/lib/utils";
import type { Settlement } from "@/types";

const memorySettlements = new Map<string, Settlement[]>();

export class SettlementDuplicateError extends Error {
  constructor() {
    super("SETTLEMENT_DUPLICATE");
    this.name = "SettlementDuplicateError";
  }
}

function memoryUpsert(settlement: Settlement): Settlement {
  const saved = { ...settlement, _optimistic: false };
  const list = memorySettlements.get(settlement.tripId) ?? [];
  memorySettlements.set(settlement.tripId, [
    saved,
    ...list.filter((s) => s.id !== settlement.id),
  ]);
  return saved;
}

function memoryFetch(tripId: string): Settlement[] {
  return [...(memorySettlements.get(tripId) ?? [])].sort(
    (a, b) =>
      new Date(b.settledAt).getTime() - new Date(a.settledAt).getTime()
  );
}

function memoryFindByToken(idempotencyToken: string): Settlement | null {
  for (const list of memorySettlements.values()) {
    const hit = list.find((s) => s.idempotencyToken === idempotencyToken);
    if (hit) return hit;
  }
  return null;
}

export function buildSettlementRecord(params: {
  tripId: string;
  fromUserId: string;
  toUserId: string;
  amountMinorUnits: number;
  currency: string;
  confirmedBy: string;
  idempotencyToken: string;
  id?: string;
  settledAt?: string;
}): Settlement {
  return {
    id: params.id ?? generateId(),
    tripId: params.tripId,
    fromUserId: params.fromUserId,
    toUserId: params.toUserId,
    amountMinorUnits: params.amountMinorUnits,
    currency: params.currency,
    confirmedBy: params.confirmedBy,
    idempotencyToken: params.idempotencyToken,
    status: "confirmed",
    settledAt: params.settledAt ?? new Date().toISOString(),
  };
}

/**
 * Persist settlement in memory. Duplicate idempotency tokens are treated as
 * a successful no-op for double-tap races.
 */
export async function persistSettlement(
  settlement: Settlement,
  notify?: {
    tripName: string;
    actor: {
      userId: string;
      displayName: string;
      avatarUrl?: string;
    };
  }
): Promise<Settlement> {
  const existing = memoryFindByToken(settlement.idempotencyToken);
  if (existing) {
    throw new SettlementDuplicateError();
  }

  const saved = memoryUpsert(settlement);

  if (notify) {
    emitSettlementConfirmedNotifications({
      settlement: saved,
      tripName: notify.tripName,
      actor: notify.actor,
    });
  }

  return saved;
}

export async function fetchSettlementByToken(
  idempotencyToken: string
): Promise<Settlement | null> {
  return memoryFindByToken(idempotencyToken);
}

export async function fetchSettlementsForTrip(
  tripId: string
): Promise<Settlement[]> {
  return memoryFetch(tripId);
}
