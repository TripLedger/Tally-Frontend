import type { SimplifiedPayment } from "@/types";

interface BalanceEntry {
  userId: string;
  amount: number;
}

/**
 * Greedy minimum cash flow debt simplification.
 * All amounts must be integer minor units.
 * Positive = owed money, negative = owes money.
 */
export function simplifyDebts(
  balances: Record<string, number>
): SimplifiedPayment[] {
  const creditors: BalanceEntry[] = Object.entries(balances)
    .filter(([, amount]) => amount > 0)
    .map(([userId, amount]) => ({ userId, amount }))
    .sort((a, b) => b.amount - a.amount);

  const debtors: BalanceEntry[] = Object.entries(balances)
    .filter(([, amount]) => amount < 0)
    .map(([userId, amount]) => ({ userId, amount }))
    .sort((a, b) => a.amount - b.amount);

  const payments: SimplifiedPayment[] = [];

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];

    const amount = Math.min(creditor.amount, -debtor.amount);

    if (amount > 0) {
      payments.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amountMinorUnits: amount,
      });
    }

    creditor.amount -= amount;
    debtor.amount += amount;

    if (creditor.amount === 0) ci++;
    if (debtor.amount === 0) di++;
  }

  return payments;
}

export function computeNetBalances(
  memberIds: string[],
  expenses: {
    payerId: string;
    baseCurrencyAmount: number;
    splitMap: { userId: string; amountMinorUnits: number }[];
  }[],
  settlements: {
    fromUserId: string;
    toUserId: string;
    amountMinorUnits: number;
  }[] = []
): Record<string, number> {
  const balances: Record<string, number> = {};
  memberIds.forEach((id) => {
    balances[id] = 0;
  });

  for (const expense of expenses) {
    balances[expense.payerId] =
      (balances[expense.payerId] ?? 0) + expense.baseCurrencyAmount;

    for (const split of expense.splitMap) {
      balances[split.userId] =
        (balances[split.userId] ?? 0) - split.amountMinorUnits;
    }
  }

  for (const settlement of settlements) {
    balances[settlement.fromUserId] =
      (balances[settlement.fromUserId] ?? 0) + settlement.amountMinorUnits;
    balances[settlement.toUserId] =
      (balances[settlement.toUserId] ?? 0) - settlement.amountMinorUnits;
  }

  return balances;
}
