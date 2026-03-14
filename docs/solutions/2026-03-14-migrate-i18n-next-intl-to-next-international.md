---
title: "Migrate i18n from next-intl to next-international"
date: 2026-03-14
pr: https://github.com/LVP-JS-Dev/cv/pull/3
status: resolved
tags: [i18n, next-intl, next-international, refactor, middleware]
---

## Problem / Symptom

`next-intl` v3 required JSON message files under `messages/{locale}.json` with
a wrapping `"root"` namespace key. Translation lookups used
`getTranslations({ namespace: "root" })` and `t.raw(...)` for array values.
The library also pulled in a heavy ICU message-format parser (`intl-messageformat`,
`@formatjs/*`, `decimal.js`, `negotiator`) that was unnecessary for a simple
two-locale static site. Additionally, `engineeringQualityPoints` was typed as a
plain JSON array, which gave no compile-time safety.

## Investigation

1. Identified that the only consumer of `next-intl` was `app/[locale]/layout.tsx`
   (`NextIntlClientProvider`) and `app/[locale]/page.tsx`
   (`getTranslations` / `t.raw`).
2. `i18n/request.ts` contained a custom `detectLocale` helper that duplicated
   logic already present in the middleware; it was otherwise unused by the new
   library.
3. The middleware matcher `/((?!_next|.*\..*).*)` was too broad — it matched
   `api`, `trpc`, and `_vercel` paths, causing unnecessary middleware runs on
   internal Next.js routes.
4. `messages/*.json` schema had a redundant top-level `"root"` wrapper plus a
   stray duplicate `"nav"` key at root level.

## Root Cause

`next-intl` v3's JSON-based, ICU-powered translation model was over-engineered
for the project's needs (two locales, flat copy, no plurals/rich formatting).
Its `t.raw()` API for arrays is not type-safe, and the JSON namespace wrapping
(`"root"`) added accidental complexity reflected in every key access
(`messages?.root?.hero?.headline`).

## Working Fix

| Area | Before | After |
|---|---|---|
| Package | `next-intl ^3.0.0` | `next-international ^0.8.0` |
| Locale data | `messages/{locale}.json` (JSON + ICU) | `locales/{locale}.ts` (typed `as const`) |
| Array values | `t.raw("sections.engineeringQualityPoints")` | Named keys `.one/.two/.three` with direct `t()` calls |
| Client provider | `NextIntlClientProvider` with pre-loaded messages | `I18nProviderClient` (lazy-loads locale modules) |
| Server helper | `getTranslations({ namespace: "root" })` | `getI18n()` from `locales/server.ts` |
| Metadata keys | `messages?.root?.hero?.headline` | `messages?.hero?.headline` |
| Middleware factory | `createMiddleware` (next-intl) | `createI18nMiddleware` (next-international) |
| Middleware matcher | `/((?!\_next\|.*\..*).*)` | `/((?!\_next\|_vercel\|api\|trpc\|.*\..*).*)` |
| `i18n/request.ts` | custom `detectLocale` helper | deleted (superseded by library internals) |
| `generateStaticParams` | absent | exported from layout via `getStaticParams` |

Removed transitive dependencies: `@formatjs/*` (5 packages), `intl-messageformat`,
`use-intl`, `decimal.js`, `negotiator` — net **−118 / +19** lines in
`package-lock.json`.

## Prevention / Tests

- **Verification performed**: `npm run lint` only (no runtime test suite exists yet).
- Type safety is now enforced at compile time: `locales/en.ts` and `locales/ru.ts`
  export `as const` objects; `next-international` infers key types from them,
  so missing or misspelled keys are caught by TypeScript.
- Future guard: adding a unit test that imports both locale modules and asserts
  structural equality (same keys) would catch translation key drift between EN and RU.
- Middleware matcher is now explicit — any new internal route (`api/*`, `trpc/*`)
  is excluded by default without further changes.

## Links

- PR: <https://github.com/LVP-JS-Dev/cv/pull/3>
- `next-international` docs: <https://github.com/QuiiBz/next-international>
- Commits:
  - `727800b` — chore: ignore worktrees directory
  - `b7a0946` — feat: migrate i18n to next-international
  - `4afb45b` — docs: add docstrings for i18n migration
