This repository contains a localized Next.js 16+ resume site built with the `app` router, Tailwind v4, and `next-international`.

## Getting started

```bash
npm install
npm run dev
```

The locale-aware experience lives under `app/[locale]`. Visiting `/` redirects to `/en`, and each locale loads its own messages from `locales/{locale}.ts`.

### Project structure

- `app/[locale]/page.tsx` — RSC landing page wired to `next-international` translations and Tailwind sections.
- `app/[locale]/layout.tsx` — locale layout with `I18nProviderClient`, metadata alternates, and `NEXT_PUBLIC_NOINDEX` for SEO.
- `content/projects.ts`, `content/experience.ts` — structured resume data for the Experience and Projects sections with support links.
- `locales/en.ts`, `locales/ru.ts` — copy for nav, hero, sections, and CTA text.
- `middleware.ts` + `next.config.ts` — route localization blueprint plus security headers.

## Running tests

No automated tests are configured. Run `npm run lint` after installing dependencies if desired.

## Git workflow

- Each feature or fix is developed in its own git worktree.
- Each meaningful change should be captured in a separate git commit.
- Prefer small, atomic commits with clear messages.
