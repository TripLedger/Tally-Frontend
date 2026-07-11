# Tally

Travel-native group expense splitting with AI receipt scanning and automatic settlement.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand (global state)
- React Hook Form + Zod
- next-themes

## Auth setup

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — for magic-link auth
- `AWS_*` + `DYNAMODB_TABLE_NAME` — for production user storage

## Troubleshooting

If the page looks unstyled (white background, default fonts, stacked layout):

```bash
# Stop the dev server (Ctrl+C), then:
rm -rf .next
npm run dev
```

Hard refresh the browser (`Ctrl+Shift+R`). Styles are served from `/_next/static/css/app/layout.css` — if that 404s, the steps above fix it.

## Getting started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is designed mobile-first (375–430px).

## Project structure

```
app/(auth)/     — landing, onboarding
app/(app)/      — authenticated routes with bottom nav shell
components/ui/  — primitives (Button, Input, BottomSheet, etc.)
components/shared/ — TripCard, ExpenseCard, MemberChip, BalancePill
features/       — feature modules (auth, trips, expenses, balances, settlements)
store/          — Zustand slices with typed hooks
lib/            — api client, currency helpers, debt simplification
types/          — shared TypeScript interfaces
```

## Zustand hooks

Import from `@/store` — never use `useStore` directly:

```ts
import { useTrips, useExpenses, useBalances, useAddToast } from "@/store";
```
