---
title: "Scaffold localized portfolio site (PR #1)"
category: frontend
tags:
  - nextjs
  - app-router
  - next-intl
  - i18n
  - metadata
  - dependencies
date: 2026-03-14
pr: https://github.com/LVP-JS-Dev/cv/pull/1
status: merged
---

## Problem / Symptom

We needed to bootstrap a multilingual Next.js App Router portfolio (RU/EN) from an empty repo. During setup we hit two concrete issues:

1) `npm install` failed because `next-intl` does not yet declare compatibility with Next 16.
2) The App Router root layout (`app/layout.tsx`) was missing, which causes runtime/build errors in Next.js.

## Investigation

- `npm install` failed with peer dependency resolution errors for `next-intl` on Next 16.
- Lint (`npm run lint`) passed after dependencies were installed.
- Dev server (`npm run dev`) started successfully and revealed a Next.js 16 warning: the `middleware` file convention is deprecated in favor of `proxy`.

## Root Cause

- `next-intl` peer dependency range currently stops at Next 15.x, so npm blocks installation for Next 16.
- The scaffolded App Router lost the required root layout (`app/layout.tsx`), leaving only `app/[locale]/layout.tsx`.

## Working Fix

- Installed dependencies using `npm install --legacy-peer-deps` to bypass the peer range conflict.
- Restored `app/layout.tsx` with `<html>/<body>` and moved the locale layout to just the i18n provider.
- Kept `app/[locale]/layout.tsx` for metadata and `NextIntlClientProvider`.

Verification:

```bash
npm run dev
npm run lint
```

## Prevention / Tests

- Prefer Next 15.x until `next-intl` adds Next 16 support, or document the `--legacy-peer-deps` workaround.
- Add a checklist item to ensure `app/layout.tsx` exists whenever App Router is used.
- Track the Next.js warning about `middleware.ts` deprecation and plan a follow-up rename to `proxy.ts` when ready.

## Follow-up TODOs

- Rename `middleware.ts` to `proxy.ts` and update matcher to exclude `/_vercel`, `/api`, `/trpc`.
- Add runtime guard for `t.raw(...)` usage to avoid crashes when messages are missing.
- Respect `anonymous` flags in content rendering to prevent accidental disclosure.

## Links

- PR: https://github.com/LVP-JS-Dev/cv/pull/1
- Plan: `docs/plans/2026-03-13-feat-senior-frontend-portfolio-site-plan.md`
- Brainstorm: `docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md`
