---
title: "feat: Senior Frontend Portfolio Site"
type: feat
status: active
date: 2026-03-13
origin: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md
---

# feat: Senior Frontend Portfolio Site

## Overview
Build a bilingual (RU/EN) portfolio site for a Senior Frontend Engineer that quickly communicates value to recruiters and tech leads while demonstrating depth in architecture, performance, accessibility, and DX (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md). The site should include 4-6 case studies, an engineering quality section, and a clear primary CTA via email with supporting links to Telegram, GitHub, LinkedIn, and CV (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md). Content can start as placeholders derived from the updated resume and be ready for future expansion without structural changes (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).

### Research Insights
- Use App Router nested layouts to keep the shell static and reduce client JS.
- Start with typed content objects (TS/JSON/MDX) instead of a CMS for v1 speed.

### Edge Cases
- RU text can be 20-30% longer; ensure layouts flex and wrap.

### Implementation Notes
- Keep content sourcing minimal and git-native; placeholders are acceptable but should be easy to swap.

### Tests
- Visual QA for RU/EN text overflow and one-screen scanability on 1440px and 375px widths.

## Problem Statement / Motivation
The portfolio needs to balance fast screening for recruiters with technical credibility for engineering leaders, while maintaining a readable, modern UI informed by Brittany Chiang (clarity), Sara Soueidan (engineering credibility), and Adam Hartwig (micro-interactions) (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md). Current materials exist primarily as a resume, so the system must support placeholders and easy content upgrades without rework.

### Research Insights
- Use a restrained motion layer to guide attention to the CTA, not to decorate every element.
- Tailwind v4 CSS-first theming can reinforce a clean, deliberate visual system.

### Edge Cases
- Over-animating critical content can slow LCP and reduce readability for recruiters.

### Implementation Notes
- Keep the above-the-fold payload minimal; reserve richer interaction for below-the-fold sections.

### Tests
- Lighthouse run on the hero section to confirm LCP and CLS budgets remain stable.

## Proposed Solution
Create a Next.js App Router site with a hiring-first narrative and a light playful layer, delivered via a clean information architecture. Implement RU/EN localization, SEO metadata (OpenGraph, JSON-LD), and performance-first rendering (RSC by default with minimal client components). Provide flexible content models for projects, experience, and optional content, and a contact CTA centered on email.

## Progress Update (2026-03-16)

### Completed
- Git-native content system: projects and experience migrated to Markdown with locale fallback.
- Project detail pages render Markdown bodies for richer case study narratives.
- Static OG/Twitter image routes remain available without edge-only runtime.
- Project detail metadata includes locale alternates + Article JSON-LD.
- Contact form delivery flow with Resend, honeypot, rate limit, and fallback messaging.
- Lighthouse CI configured for /en and /ru with score budgets.
- NDA guardrail: anonymous projects require industry in frontmatter.
- NDA content review checklist added: docs/checklists/nda-content-review.md.

### Remaining
- None.

### Research Insights
- Keep most sections as RSC and isolate interactivity in leaf client components.
- Use `next-international` with `app/[locale]` routing and `generateMetadata` per locale.

### Edge Cases
- Missing `hreflang` alternates harms RU/EN SEO.
- Locale fallback not handled can lead to 404 on `/` or mismatched language.

### Implementation Notes
| Decision | Chosen | Alternative | Why Chosen |
| --- | --- | --- | --- |
| i18n routing | `app/[locale]` + next-international | subdomains / next-i18next | Lower deploy complexity and consistent previews |
| Content source | Typed TS objects | MDX / CMS | Fast iteration with placeholders and no external deps |
| Contact backend | Server Action | `/api/contact` route | One surface to audit; avoid duplication |
| Animation | Motion | CSS-only / GSAP | Reduced-motion support built-in |
| 3D playground | Deferred (Phase D) | In scope now | High complexity, lower hiring ROI at launch |

- Default locale: redirect `/` to `/en` in middleware without `Accept-Language` detection to preserve caching; users switch locale explicitly.
- Locale switcher must preserve the current path segment.

### Tests
- Playwright: `/en` and `/ru` render correct `<html lang>` and `hreflang` alternates.
- Locale switcher preserves pathname across languages.

## Technical Considerations
- **Framework/Stack**: Next.js App Router + TypeScript, Tailwind CSS, Motion for animations, optional 3D playground (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- **i18n**: Route segment locales (e.g., `app/[locale]`) with `next-international` routing, RU/EN alternates in metadata.
- **SEO**: Metadata API with canonical and `alternates.languages`, OpenGraph image, sitemap/robots, JSON-LD for Person + WebSite.
- **Performance**: RSC by default; client components only where needed for animation and interaction. Use `next/image` and `next/font` to keep Lighthouse >= 90 (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- **Contact**: Server Actions for contact form with basic anti-spam (honeypot + rate limit). Primary CTA email; Telegram as secondary.
- **Deployment**: Vercel recommended; Docker-based deploy is not supported by Vercel, so Dockerfile is for self-hosting only.

### Research Insights
- Use `metadataBase` with Metadata API to ensure absolute URLs for OG and canonical.
- Prefer static OG images for stability; only use dynamic `ImageResponse` if needed.
- Respect reduced-motion with `MotionConfig` or `useReducedMotion`.
- Configure fonts with `next/font` to avoid CLS.

### Edge Cases
- OG image generation can time out on dynamic routes; static assets are safer.
- Root layout marked as client component inflates JS and hurts Lighthouse.

### Implementation Notes
- Keep the root layout as RSC; isolate Motion to leaf client components.
- Decide on Server Actions for contact and avoid parallel API routes.
- Add `alternates.languages` for RU/EN and set a canonical per locale.
- Contact delivery: use Resend by default with a `mailto:` fallback if email sending is out of scope.
- Rate limit storage: Vercel KV or Upstash Redis to persist limits across serverless invocations.
- Security headers baseline: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

### Tests
- Lighthouse CI for `/en` and `/ru` with mobile preset.
- Metadata check: canonical, alternates, OG image present.

## System-Wide Impact
- **Interaction graph**: Static pages + minimal client components; contact form posts to a server action or API route; no background jobs required.
- **Error propagation**: Contact submission errors should surface as inline form states; no cross-service retries needed.
- **State lifecycle risks**: Minimal; only form submission state. Ensure no partial state persists on failed submit.
- **API surface parity**: Keep contact handler in one place to avoid duplicates (server action or API route, not both).
- **Integration test scenarios**: RU/EN routing, contact submission success/failure, OpenGraph/metadata generation, Lighthouse checks.

### Research Insights
- Prefer Server Actions for form submission to reduce surface area and bundle size.
- Use `useActionState` / `useFormStatus` for pending and error UI states.

### Edge Cases
- Spam bots can flood Server Actions without rate limits.
- Locale switcher that drops path segments breaks deep links.

### Implementation Notes
- Add a simple honeypot + rate limit before any email send.
- Locale switcher must preserve the current pathname and hash.

### Tests
- Contact form: success, error, and honeypot rejection.
- Locale switcher preserves path across RU/EN.

## Acceptance Criteria
- [x] Site renders in RU and EN with locale-specific routing and `hreflang` alternates.
- [x] Information architecture includes Hero, About, Experience, Selected Projects, Engineering Quality, Content/Writing, Contact CTA (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- [x] 4-6 case study entries supported with balanced focus (business impact + technical depth), with partial anonymization support (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- [x] Primary CTA is email; secondary links include Telegram, GitHub, LinkedIn, and CV (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- [x] Lighthouse >= 90 across Performance/Accessibility/Best Practices/SEO on a representative build (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- [x] Metadata includes canonical URL, OpenGraph tags, and JSON-LD for Person + WebSite.
- [x] Content placeholders are seeded from resume data and clearly marked for replacement (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- [x] `noindex` is enabled for non-production previews via env flag and disabled for production launch.
- [x] Lighthouse CI runs on preview or production URL with mobile and desktop presets.
- [x] Contact form uses an explicit provider (Resend) or falls back to `mailto:`.

### Research Insights
- Run Lighthouse in CI to avoid regressions and confirm mobile budgets.
- Validate JSON-LD via Rich Results or schema.org validator.

### Edge Cases
- Placeholder content can be indexed; add `noindex` until launch-ready.
- Mobile budgets can pass desktop but fail on throttled mobile.

### Implementation Notes
- Add explicit measurement targets:
  - Lighthouse: Performance >= 90, Accessibility >= 95, Best Practices >= 90, SEO = 100 on desktop and mobile.
  - Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
  - RU/EN: `hreflang` alternates and `<html lang>` match locale.
  - NDA: anonymized projects must avoid client names in slug, title, or text.
- `noindex` should be controlled by `NEXT_PUBLIC_NOINDEX=true` for previews and false for production.
- Lighthouse CI: use `@lhci/cli` to test `/en` and `/ru` on a deployed URL (preview or prod).

### Tests
- Playwright: locale routing, `hreflang`, and contact flow.
- Axe: no critical/serious WCAG 2.1 AA violations.
- Contact form tests should mock the email provider (Resend) or verify `mailto:` fallback only.

## Success Metrics
- Lighthouse scores meet targets on desktop and mobile.
- Recruiters/tech leads can identify role, focus, and contact path within the first screen.
- At least one inbound contact path validated (email submission or direct email link).

### Research Insights
- Keep the hero lightweight and CTA above the fold to optimize scan time.
- Consider `mailto:` as the primary CTA with a copy-to-clipboard helper.

### Edge Cases
- Contact info buried behind interactions reduces conversion.

### Implementation Notes
- Track Vercel Web Vitals and review post-deploy for regressions.
- Observability beyond Vercel Web Vitals is out of scope for v1.

### Tests
- Manual UX pass: CTA visible on 375px and 1440px without scrolling.

## Dependencies & Risks
- **Content readiness**: case studies and media are not prepared; plan for placeholder content and easy replacement.
- **NDA constraints**: some projects require anonymization (see brainstorm: docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md).
- **Deploy target**: Vercel does not accept Docker images; Dockerfile is only for self-hosted deployment.
- **Animation scope**: keep motion tasteful to avoid performance regressions or accessibility issues.

### Research Insights
- Use `transform` and `opacity` for animations to keep frames smooth.
- RU/EN text length variance affects layout; design for longer strings.

### Edge Cases
- NDA violations can occur via URL slugs or logos, not just body text.
- Motion-heavy sections can degrade LCP on mobile.

### Implementation Notes
- Add a content review checklist for NDA-safe placeholders and slugs.
- Gate launch with reduced-motion compliance and mobile Lighthouse pass.
- Enforce NDA anonymization with a content model flag (e.g., `anonymous: true`) and slug/title constraints.
- Dockerfile is out of scope unless self-hosting is explicitly required.

### Tests
- Verify anonymized case studies contain no identifiable client names in URLs.

## Implementation Outline (High-Level)
1. Define content models (projects, experience, talks/articles) and placeholder content from resume.
2. Create route structure with RU/EN locales and base layout.
3. Implement core sections with responsive layout and minimal client components.
4. Add motion layer with reduced-motion support.
5. Add SEO metadata, JSON-LD, and sitemap/robots.
6. Implement contact form handler and CTA block.
7. Run Lighthouse checks and remediate.

### Research Insights
- Establish routing and i18n early; changing locale architecture later is costly.
- Apply motion last as progressive enhancement after layout is stable.

### Edge Cases
- Deferring SEO until late can leave pages without canonical/OG metadata.

### Implementation Notes
Phase A — Skeleton & Content Model (shippable)
- Scaffold Next.js App Router + TypeScript + Tailwind.
- Define typed content models and seed placeholders from resume.
- Implement `app/[locale]` routing, `hreflang`, and base layout.
- Add baseline `generateMetadata` with `noindex` env flag for previews.
- Add security headers baseline in `next.config`.

Phase B — Core Sections (shippable)
- Build Hero, About, Experience, Projects, Engineering Quality, Contact CTA.
- Add project detail route stubs with anonymization rules.

Phase C — Quality Layer (launch gate)
- Motion layer with reduced-motion guards.
- SEO metadata, JSON-LD, OG images, sitemap/robots (expand beyond baseline).
- Contact form Server Action with anti-spam.
- Lighthouse CI and remediation.

Phase D — Post-launch slot
- Playground slot (optional).

### Tests
- Playwright: homepage → project detail → back navigation for RU/EN.
- Lighthouse CI for `/en` and `/ru` on mobile preset.

## Sources & References
- **Origin brainstorm:** docs/brainstorms/2026-03-13-senior-frontend-portfolio-brainstorm.md (key decisions carried forward)
- Next.js Metadata API: https://github.com/vercel/next.js/blob/v15.1.8/docs/01-app/03-api-reference/04-functions/generate-metadata.mdx
- Next.js i18n (App Router): https://github.com/vercel/next.js/blob/v15.1.8/docs/01-app/02-building-your-application/01-routing/15-internationalization.mdx
- Next.js Production Checklist: https://github.com/vercel/next.js/blob/v15.1.8/docs/01-app/02-building-your-application/10-deploying/01-production-checklist.mdx
- Tailwind CSS Next.js guide: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Motion accessibility: https://motion.dev/docs/react-accessibility
- Schema.org Person: https://schema.org/Person
- Schema.org WebSite: https://schema.org/WebSite
- Vercel Docker support note: https://vercel.com/kb/guide/does-vercel-support-docker-deployments
