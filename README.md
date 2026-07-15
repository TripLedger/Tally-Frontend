# Tally

**Split expenses. Stay friends.**

**Live app:** [https://tally-frontend-xi.vercel.app/](https://tally-frontend-xi.vercel.app/)

Tally is a mobile-first group expense app built for trips with friends. Create a trip, invite people, log shared costs, see who owes whom, and mark settlements when money changes hands offline. Tally does **not** move money — it keeps a clear shared record so nobody has to dig through chat threads for “who paid for dinner.”

The product differentiator is **AI receipt scanning with line-item assignment**: scan a restaurant bill, let Claude extract each item, then tag who ordered what in under a minute — instead of typing every amount by hand.

---

## Why Tally

Most expense splitters stop at “enter a total and split equally.” That works for an Uber. It fails at a shared meal where Ada had pepper soup, Bola had jollof, and Chidi took both shawarmas.

Tally’s answer:

1. **AI extracts** line items from the receipt (name, quantity, price).
2. **You assign** each line to one or more trip members (or everyone).
3. **Balances update** from a derived split map — same debt math as manual expenses.

Equal-split paths (transport, lodging) still work in one tap. Line-item assignment is additive, not a replacement.

---

## Features

### Trips & people
- Create trips with destination, dates, and a base currency
- Invite members via shareable join links
- Organizer and member roles on the trip detail screen

### Expenses
- Manual entry with equal or custom splits
- Categories (food, transport, lodging, activities, other)
- Multi-currency amounts with FX conversion into the trip base currency
- Optional receipt photo attachment

### AI receipt scan (hero flow)
- Camera capture or gallery upload
- Claude OCR returns merchant, total, currency, confidence, and **line items**
- **Split Mode Decision** sheet after a successful itemized scan:
  - **Assign by item** → tag members per line (progress bar + unassigned counter; save blocked until every unit is assigned)
  - **Split equally** → jump to the existing Add Expense form, prefilled
- Total-only / unreadable receipts fall back to the manual form

### Balances & settlements
- Per-trip and aggregate balance views
- Debt simplification (fewer payments, same outcome)
- Confirm offline settlements; history stays on the trip

### Account & polish
- Google OAuth and email magic-link sign-in
- Onboarding (display name + home currency)
- Profile preferences and sign-out
- In-app notifications (joins, expenses, settlements)
- Public Terms of Service and Privacy Policy

---

## Stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 14 (App Router), TypeScript |
| UI | Tailwind CSS, Lucide icons, Inter, mobile shell (≈375–430px) |
| Forms | React Hook Form + Zod |
| State | Zustand (`store/`) with typed hooks |
| Auth | Supabase Auth (Google + magic link) |
| Data | Supabase Postgres + RLS; Storage for receipt images |
| Legacy / optional | AWS DynamoDB for some user fields |
| AI | Anthropic Claude (`POST /api/expenses/scan`) |
| FX | exchangerate.host (optional key) with open.er-api.com fallback |

---

## Getting started

### Prerequisites
- Node.js 18+
- A Supabase project
- Anthropic API key (for receipt scan)
- Optional: AWS credentials if you use DynamoDB user sync

### Install & run

```bash
npm install
cp .env.local.example .env.local
# Fill in the variables below, then:
npm run dev
```

Open [https://tally-frontend-xi.vercel.app/](https://tally-frontend-xi.vercel.app/) for the live app. For local development, the server runs on your machine after `npm run dev`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Debt-simplification unit tests |

---

## Environment variables

Copy from `.env.local.example`:

```bash
NEXT_PUBLIC_APP_URL=https://tally-frontend-xi.vercel.app

# Supabase (required for auth + primary data)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional DynamoDB user storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DYNAMODB_TABLE_NAME=

# Receipt OCR (required for AI scan)
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=          # optional; defaults to claude-sonnet-4-5

# FX (optional)
FX_API_KEY=
```

For local development, set `NEXT_PUBLIC_APP_URL` to your local origin and match Supabase Auth redirect URLs accordingly.

---

## Supabase setup

Run the SQL in the Supabase SQL editor (order suggested below). Scripts are written to be safe to re-run.

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Core trips, members, invites, expenses, RLS |
| `supabase/expenses.sql` | Expenses table (if not covered by schema) |
| `supabase/settlements.sql` | Settlement records |
| `supabase/fx.sql` | Cached FX rates |
| `supabase/notifications.sql` | In-app notifications |
| `supabase/receipt-scan.sql` | Receipt URL column + `receipts` storage bucket |
| `supabase/expense-line-items.sql` | `line_items` jsonb for AI assign flow |
| `supabase/fix-invite-rpc.sql` | Invite lookup RPC fix if join links fail |

Also configure Supabase Auth providers (Google + email) and redirect URLs to match `NEXT_PUBLIC_APP_URL` (e.g. `/auth/callback`).

---

## App structure

```
app/(auth)/          Landing + onboarding
app/(app)/           Authenticated shell (bottom nav)
app/(legal)/         Terms + Privacy
app/join/            Invite join flow
app/auth/            OAuth / magic-link callbacks
app/api/             scan, fx, notifications, user

components/ui/       Primitives (BottomSheet, Avatar, …)
components/layout/   MobileShell, BottomNav, StickyHeader
features/            auth, trips, expenses, balances, settlements,
                     notifications, profile
store/               Zustand slices + selectors
lib/                 currency, FX, debt math, DB helpers, storage
supabase/            SQL migrations / policies
types/               Shared TypeScript models
```

### Important routes

| Route | What it does |
|-------|----------------|
| `/` | Landing + sign-in |
| `/onboarding` | Display name + home currency |
| `/dashboard` | Active / past trips |
| `/trips/new` | Create trip |
| `/trips/[tripId]` | Trip detail, members, expenses |
| `/trips/[tripId]/invite` | Invite link |
| `/join/[token]` | Accept invite |
| `/trips/[tripId]/expenses/new` | Manual / prefilled add expense |
| `/trips/[tripId]/expenses/scan` | Camera + OCR |
| `/trips/[tripId]/expenses/assign` | Line-item member assignment |
| `/balances` | Aggregate balances |
| `/trips/[tripId]/balances` | Trip balances |
| `/trips/[tripId]/settlements` | Settlement history / confirm |
| `/profile` | Account preferences |
| `/notifications` | Activity feed |
| `/terms`, `/privacy` | Legal |

---

## How the AI scan flow works

```
Scan receipt
    → Claude extracts line items (+ total, merchant, currency)
    → If line items exist: Split Mode sheet
         ├─ Assign by item → /expenses/assign → derive splits → save
         └─ Split equally  → /expenses/new (prefilled)
    → If total only / OCR failed: /expenses/new (existing fallback)
```

Per-line `splitMap` values are summed into the expense-level `splitMap` before save. Balance calculation, debt simplification, and settlements read that top-level map — they do not care whether the expense came from OCR or manual entry.

---

## State conventions

Import typed hooks from `@/store` — avoid reaching for the raw store unless necessary:

```ts
import {
  useTrips,
  useExpenses,
  useBalances,
  useUnassignedTotal,
  useAddToast,
} from "@/store";
```

---

## Troubleshooting

**Unstyled page / chunk 404s** (`layout.css` or `main-app.js` 404):

```bash
# Stop the dev server (Ctrl+C), then:
rm -rf .next
npm run dev
```

Hard-refresh the browser (`Ctrl+Shift+R`).

**Receipt scan always fails:** confirm `ANTHROPIC_API_KEY` is set and the server was restarted after editing `.env.local`.

**Save after assign fails on `line_items`:** run `supabase/expense-line-items.sql`.

**Invite links broken:** run `supabase/fix-invite-rpc.sql` and verify Auth redirect URLs.

---

## Design notes

- Dark canvas (`#0A0A0F`), surfaces `#13131A` / `#1C1C27`
- Accent gradient `#7C3AED → #2563EB`
- Status: green `#10B981` (assigned / settled), rose `#F43F5E` (owed / left)
- Built mobile-first; desktop centers a phone-width frame

---

## License

Private / hackathon project — all rights reserved unless otherwise noted.
