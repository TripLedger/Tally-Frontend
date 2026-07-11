"use client";

import { StickyHeader } from "@/components/layout/StickyHeader";
import { Spinner } from "@/components/ui/Spinner";
import {
  useBalances,
  useSimplifiedPayments,
  useSettlements,
  useBalancesLoading,
  useActiveTrip,
} from "@/store";

interface BalancesPageProps {
  params: { tripId: string };
}

export default function BalancesPage({ params }: BalancesPageProps) {
  const balances = useBalances();
  const payments = useSimplifiedPayments();
  const settlements = useSettlements();
  const isLoading = useBalancesLoading();
  const activeTrip = useActiveTrip();

  const currency = activeTrip?.baseCurrency ?? "USD";

  return (
    <>
      <StickyHeader
        title="Balances"
        backHref={`/trips/${params.tripId}`}
      />
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-disabled">
                Your position
              </h2>
              {balances.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  Balances appear once expenses are logged. Add your first
                  expense to see who owes who.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {balances.map((balance) => (
                    <div
                      key={balance.userId}
                      className="flex items-center justify-between rounded-card border border-border-glass bg-background-card px-4 py-3"
                    >
                      <span className="text-sm text-text-primary">
                        {balance.displayName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-disabled">
                Settle up
              </h2>
              {payments.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  When debts exist, Tally simplifies them to the fewest
                  payments needed — e.g. &ldquo;Bola pays Ada {currency}{" "}
                  4,000.&rdquo;
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {payments.map((payment, i) => (
                    <div
                      key={i}
                      className="rounded-card border border-border-glass bg-background-card px-4 py-3 text-sm text-text-primary"
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-disabled">
                Settlement history
              </h2>
              {settlements.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  Completed payments will appear here with timestamps.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {settlements.map((s) => (
                    <div key={s.id} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
