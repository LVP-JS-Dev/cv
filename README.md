This repository contains a localized Next.js 16+ resume site built with the `app` router, Tailwind v4, and `next-intl`.

## Getting started

```bash
npm install
npm run dev
```

The locale-aware experience lives under `app/[locale]`. Visiting `/` redirects to `/en`, and each locale loads its own messages from `messages/{locale}.json`.

### Project structure

- `app/[locale]/page.tsx` — RSC landing page wired to `next-intl` translations and Tailwind sections.
- `app/[locale]/layout.tsx` — root layout with `NextIntlClientProvider`, metadata alternates, and `NEXT_PUBLIC_NOINDEX` for SEO.
- `content/projects.ts`, `content/experience.ts` — structured resume data for the Experience and Projects sections with support links.
- `messages/en.json`, `messages/ru.json` — copy for nav, hero, sections, and CTA text.
- `middleware.ts` + `next.config.ts` — route localization blueprint plus security headers.

## Running tests

Run `npm run lint` after installing dependencies if desired.

### E2E and accessibility

```bash
npx playwright install
npm run test:e2e
npm run test:a11y
```

### Lighthouse CI

```bash
npm run lhci
```

## Git workflow

- Each feature or fix is developed in its own git worktree.
- Each meaningful change should be captured in a separate git commit.
- Prefer small, atomic commits with clear messages.
