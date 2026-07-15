-- Optional line-item assignment payload for AI receipt flow.
-- Safe to re-run.

alter table public.expenses
  add column if not exists line_items jsonb not null default '[]'::jsonb;
