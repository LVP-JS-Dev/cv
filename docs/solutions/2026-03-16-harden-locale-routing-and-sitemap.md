---
title: "Harden locale routing, SSR html lang, and sitemap accuracy"
date: 2026-03-16
status: resolved
tags: [i18n, locale-routing, proxy, ssr, html-lang, sitemap, playwright, lighthouse, nda]
commits: [4d353c7, 026ded2, 7e4a292, e9fa4e3, 40d06fb]
scope: proxy.ts · app/layout.tsx · components/HtmlLang.tsx (removed) · lib/content.ts · app/sitemap.ts · tests/e2e/locale-routing.spec.ts · docs/checklists/nda-content-review.md · docs/plans/2026-03-16-feat-production-readiness.md
---

## Problem / Symptom

1. Root redirects to `/{locale}` worked, but SSR `<html lang>` was always
   `defaultLocale` (`"en"`), so crawlers and screen readers saw English even
   on Russian pages.
2. Locale preference stored in `Next-Locale` cookie was not applied on a cold
   visit to `/`, causing returning users to be redirected by `Accept-Language`
   only.
3. The sitemap listed only `/en` and `/ru`, leaving project case studies
   undiscoverable for search engines.
4. Locale-specific project pages were listed even when a translation file was
   missing, producing invalid sitemap URLs.
5. Anonymous projects lacked a guardrail to ensure the `industry` field was
   present, making NDA-safe entries less informative.
6. Project detail pages lacked an Article JSON-LD payload.

## Investigation

1. `app/layout.tsx` rendered `<html lang={defaultLocale}>` without any locale
   signal. `components/HtmlLang.tsx` patched the value on the client, which is
   too late for SEO and accessibility tooling.
2. `proxy.ts` (Next proxy) only set locale cookies on already-prefixed routes
   and did not read the cookie for root requests.
3. `app/sitemap.ts` listed only locale root routes and could not distinguish
   between translated and fallback-only project content.
4. `lib/content.ts` always fell back to `defaultLocale`, so there was no strict
   signal for translation availability.
5. No JSON-LD `Article` metadata was present for project detail pages.

## Root Cause

- Locale resolution was split between client patches and middleware without a
  single SSR source of truth for `lang`.
- `getLocaleFilePath` had no strict mode, so sitemap generation could not
  filter locale-specific slugs.
- Project metadata did not include structured data for case studies.
- NDA rules were documented but not enforced in content validation.

## Working Fix

1. **Custom locale detection in `proxy.ts`**
   - `Next-Locale` cookie takes priority.
   - `Accept-Language` parsed manually with safe fallback.
   - Root `/` redirects to `/{locale}` and sets `x-locale` and cookie.
2. **SSR `lang` attribute**
   - `app/layout.tsx` reads `x-locale` from `headers()` at render time and
     validates it against supported locales.
   - `components/HtmlLang.tsx` removed to avoid client-side mutation.
3. **Locale-aware sitemap**
   - `getProjectSlugsForLocale(locale)` added to `lib/content.ts`.
   - `app/sitemap.ts` now includes only slugs with a locale-specific markdown
     file for each locale.
4. **Content and SEO enhancements**
   - Enforced `industry` for `anonymous: true` projects.
   - Added Article JSON-LD for project detail pages.
   - Added NDA review checklist and production readiness plan docs.

## Prevention / Tests

- `npm run test:e2e`
  - Root redirect by locale.
  - Cookie priority over `Accept-Language`.
  - `html[lang]` matches locale.
- `npm run test:axe`
  - Playwright-based axe checks on `/en` and `/ru`.
- `npm run lhci`
  - Lighthouse assertions for performance and SEO on localized routes.

## Links

- https://nextjs.org/docs/app/building-your-application/routing/internationalization
- https://nextjs.org/docs/app/api-reference/functions/headers
- https://playwright.dev/docs/emulation#locale--timezone
- https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
