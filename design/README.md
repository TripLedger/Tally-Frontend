# Tabr design references

Drop Figma exports here. These folders are for **design handoff only** — not production assets (those go in `public/tabr/` once we wire them into the app).

## Folders

| Folder | Use for |
|--------|---------|
| `auth/` | Landing (S-01), sign-in / sign-up states, Google/email flows |
| `onboarding/` | Onboarding (S-02), currency picker, success/exit states |

## Reusable brand marks

`design/auth/tabr.png` and `design/auth/Google.png` are handoff exports.

In the app they are reusable components (not page-local):

- `features/auth/TabrLogo.tsx` — raster wordmark from `/tabr/brand/tabr-logo.png`
- `features/auth/GoogleIcon.tsx` — SVG Google G (official brand colors)

Production copies live under `public/tabr/brand/`.

## How to export from Figma

1. Select the **frame** (full screen).
2. Export as **PNG @2x** (or SVG for icons/logos).
3. Name clearly, e.g. `signup-default.png`, `signup-filled.png`.
4. Drop files into the matching folder above.

## Auth screens (implemented)

- `/sign-up` — Create your account (no fake status bar / home indicator)
- `/sign-in` — Welcome back
- `/forgot-password` — Forgot password email
- `/forgot-password/otp` — OTP empty / filled / error
- Fake iOS chrome from Figma frames is **not** rendered — OS handles safe areas via `env(safe-area-inset-*)`.
