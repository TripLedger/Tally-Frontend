import type { WalletTransaction } from "./transactionHistoryTypes";

/** Build an ISO timestamp in the local timezone for preview data. */
function localIso(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number
): string {
  const date = new Date(year, monthIndex, day, hour, minute, 0, 0);
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = String(abs % 60).padStart(2, "0");
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:00${sign}${oh}:${om}`;
}

function buildMockTransactions(): WalletTransaction[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  // Keep days in-range for short months.
  const day = Math.min(11, now.getDate());

  const prev = new Date(y, m - 1, 1);
  const py = prev.getFullYear();
  const pm = prev.getMonth();

  return [
    {
      id: "tx-cur-dinner",
      title: "Dinner at Makini Bar",
      tripName: "Diani Beach Weekend",
      occurredAt: localIso(y, m, day, 20, 42),
      amountMinor: -266_700,
      currency: "NGN",
      category: "food",
      status: "completed",
    },
    {
      id: "tx-cur-kwame",
      title: "Kwame paid you",
      tripName: "Diani Beach Weekend",
      occurredAt: localIso(y, m, day, 16, 5),
      amountMinor: 420_000,
      currency: "NGN",
      category: "income",
      status: "completed",
    },
    {
      id: "tx-cur-transport",
      title: "Return transport",
      tripName: "Diani Beach Weekend",
      occurredAt: localIso(y, m, Math.min(day + 1, 28), 9, 10),
      amountMinor: -400_000,
      currency: "NGN",
      category: "transport",
      status: "pending",
    },
    {
      id: "tx-cur-boat",
      title: "Boat ride & snorkelling",
      tripName: "Diani Beach Weekend",
      occurredAt: localIso(y, m, Math.max(day - 1, 1), 14, 20),
      amountMinor: -300_000,
      currency: "NGN",
      category: "activities",
      status: "completed",
    },
    {
      id: "tx-cur-stay",
      title: "Accommodation",
      tripName: "Diani Beach Weekend",
      occurredAt: localIso(y, m, Math.max(day - 2, 1), 11, 0),
      amountMinor: -900_000,
      currency: "NGN",
      category: "lodging",
      status: "failed",
    },
    {
      id: "tx-prev-refund",
      title: "Restaurant deposit refund",
      tripName: "Lagos Food Crawl",
      occurredAt: localIso(py, pm, 22, 13, 30),
      amountMinor: 650_000,
      currency: "NGN",
      category: "income",
      status: "completed",
    },
    {
      id: "tx-prev-bolt",
      title: "Bolt rides",
      tripName: "Lagos Food Crawl",
      occurredAt: localIso(py, pm, 20, 18, 15),
      amountMinor: -380_000,
      currency: "NGN",
      category: "transport",
      status: "completed",
    },
  ];
}

/**
 * Placeholder history matching the Figma Transaction history frame.
 * Anchored to the current / previous calendar month so the preview is visible.
 * Replace when wallet/transaction APIs are wired.
 */
export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] =
  buildMockTransactions();
