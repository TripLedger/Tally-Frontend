import { emitExpenseLoggedNotifications } from "@/lib/notifications/emit";
import { generateId } from "@/lib/utils";
import type {
  Expense,
  ExpenseSplit,
  FxRateSource,
  TripMember,
} from "@/types";

const memoryExpenses = new Map<string, Expense[]>();

function memoryUpsert(expense: Expense): Expense {
  const saved = { ...expense, _optimistic: false };
  const list = memoryExpenses.get(expense.tripId) ?? [];
  memoryExpenses.set(expense.tripId, [
    saved,
    ...list.filter((e) => e.id !== expense.id),
  ]);
  return saved;
}

function memoryFetch(tripId: string): Expense[] {
  return [...(memoryExpenses.get(tripId) ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function memoryGet(tripId: string, expenseId: string): Expense | null {
  return memoryExpenses.get(tripId)?.find((e) => e.id === expenseId) ?? null;
}

export function buildExpenseRecord(params: {
  tripId: string;
  payerId: string;
  amountMinorUnits: number;
  currency: string;
  baseCurrency: string;
  /** Resolved by the /api/fx/rate route before the record is built. */
  fx: {
    convertedAmountMinorUnits: number;
    rate: string;
    rateTimestamp: string;
    rateSource: FxRateSource;
  };
  needsCurrencyReview: boolean;
  splitMethod: "equal" | "custom";
  splitMap: ExpenseSplit[];
  lineItems?: Expense["lineItems"];
  category: Expense["category"];
  note?: string;
  merchant?: string;
  receiptImageUrl?: string;
  createdBy: string;
  id?: string;
}): Expense {
  const now = new Date().toISOString();

  return {
    id: params.id ?? generateId(),
    tripId: params.tripId,
    payerId: params.payerId,
    createdBy: params.createdBy,
    amountMinorUnits: params.amountMinorUnits,
    currency: params.currency,
    // BALANCES (4.6): baseCurrencyAmount is the only field balance math may
    // sum — access it through getExpenseAmountForBalances() in lib/fx-math.
    baseCurrencyAmount: params.fx.convertedAmountMinorUnits,
    fxRate: params.fx.rate,
    fxCached: params.fx.rateSource === "cached",
    rateTimestamp: params.fx.rateTimestamp,
    rateSource: params.fx.rateSource,
    needsCurrencyReview: params.needsCurrencyReview,
    category: params.category,
    note: params.note,
    merchant: params.merchant,
    splitMethod: params.splitMethod,
    splitMap: params.splitMap,
    lineItems: params.lineItems ?? [],
    ocrSource: Boolean(params.receiptImageUrl),
    receiptImageUrl: params.receiptImageUrl,
    createdAt: now,
  };
}

/**
 * Persist expense then emit member notifications as a non-blocking side effect.
 * Pass trip/actor context when available so alerts can be denormalized at write time.
 */
export async function persistExpense(
  expense: Expense,
  notify?: {
    tripName: string;
    members: TripMember[];
    actor: {
      userId: string;
      displayName: string;
      avatarUrl?: string;
    };
  }
): Promise<Expense> {
  const saved = memoryUpsert(expense);

  if (notify) {
    emitExpenseLoggedNotifications({
      expense: saved,
      tripName: notify.tripName,
      members: notify.members,
      actor: notify.actor,
    });
  }

  return saved;
}

export async function fetchExpensesForTrip(tripId: string): Promise<Expense[]> {
  return memoryFetch(tripId);
}

export async function fetchExpenseById(
  tripId: string,
  expenseId: string
): Promise<Expense | null> {
  return memoryGet(tripId, expenseId);
}

export function seedMemoryExpense(expense: Expense): void {
  memoryUpsert(expense);
}
