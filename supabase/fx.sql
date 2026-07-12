-- Tally — Multi-currency FX support (run once in Supabase SQL editor)
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- FX rate cache — one row per currency pair, overwritten on each live fetch.
-- Equivalent of the FXRATE#<base>#<target> item in the PRD data model.
-- ---------------------------------------------------------------------------
create table if not exists public.fx_rates (
  base_currency   text not null,
  target_currency text not null,
  rate            numeric not null check (rate > 0),
  fetched_at      timestamptz not null default now(),
  primary key (base_currency, target_currency)
);

alter table public.fx_rates enable row level security;

-- The cache holds public market data — any signed-in user may read/refresh it.
drop policy if exists "fx_rates_select_authenticated" on public.fx_rates;
create policy "fx_rates_select_authenticated" on public.fx_rates
  for select to authenticated using (true);

drop policy if exists "fx_rates_insert_authenticated" on public.fx_rates;
create policy "fx_rates_insert_authenticated" on public.fx_rates
  for insert to authenticated with check (true);

drop policy if exists "fx_rates_update_authenticated" on public.fx_rates;
create policy "fx_rates_update_authenticated" on public.fx_rates
  for update to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Expense FX metadata (extends 4.3 expense rows)
-- fx_rate / fx_cached already exist in schema.sql.
-- ---------------------------------------------------------------------------
alter table public.expenses
  add column if not exists rate_timestamp timestamptz,
  add column if not exists rate_source text not null default 'live'
    check (rate_source in ('live', 'cached')),
  add column if not exists needs_currency_review boolean not null default false;

-- ---------------------------------------------------------------------------
-- Base-currency lock — null until the trip's first expense, then set once.
-- ---------------------------------------------------------------------------
alter table public.trips
  add column if not exists base_currency_locked_at timestamptz;

-- Lock the trip's base currency atomically with the first expense insert.
create or replace function public.lock_trip_base_currency()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.trips
  set base_currency_locked_at = now()
  where id = new.trip_id
    and base_currency_locked_at is null;
  return new;
end;
$$;

drop trigger if exists expenses_lock_base_currency on public.expenses;
create trigger expenses_lock_base_currency
  after insert on public.expenses
  for each row execute function public.lock_trip_base_currency();

-- Enforce the lock: once set, base_currency can never change.
create or replace function public.prevent_base_currency_change()
returns trigger
language plpgsql
as $$
begin
  if old.base_currency_locked_at is not null
     and new.base_currency is distinct from old.base_currency then
    raise exception 'BASE_CURRENCY_LOCKED';
  end if;
  -- The lock timestamp itself is write-once too.
  if old.base_currency_locked_at is not null
     and new.base_currency_locked_at is distinct from old.base_currency_locked_at then
    raise exception 'BASE_CURRENCY_LOCKED';
  end if;
  return new;
end;
$$;

drop trigger if exists trips_prevent_base_currency_change on public.trips;
create trigger trips_prevent_base_currency_change
  before update on public.trips
  for each row execute function public.prevent_base_currency_change();
