-- Run this in Supabase SQL Editor if invite links show "Link not valid".
-- Safe to re-run.

-- Fix lookup return type (PostgREST expects SETOF → array in JS client)
create or replace function public.lookup_trip_by_invite_token(p_token text)
returns setof public.trips
language sql
security definer
set search_path = public
as $$
  select *
  from public.trips
  where invite_token = p_token
  limit 1;
$$;

-- Allow browser clients to call invite RPCs
grant execute on function public.is_trip_member(uuid, uuid) to anon, authenticated;
grant execute on function public.lookup_trip_by_invite_token(text) to anon, authenticated;
grant execute on function public.join_trip_via_token(text, text, text) to anon, authenticated;
