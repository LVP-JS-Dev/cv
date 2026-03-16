---
title: "feat: Production Readiness"
type: feat
status: draft
date: 2026-03-16
origin: 2026-03-13-feat-senior-frontend-portfolio-site-plan.md
---

# Production Readiness Plan

## Scope

Six work items required before the site is safe to deploy publicly as a real portfolio:

| # | Item | Current state | Target state |
|---|------|--------------|--------------|
| 1 | Locale auto-redirect at `/` | 404 or falls through to root `layout.tsx` | Middleware reads `Accept-Language` + `NEXT_LOCALE` cookie → 307 to `/en` or `/ru` |
| 2 | SSR `<html lang>` | Always `"en"` (hardcoded in `app/layout.tsx`); client JS patches it after hydration via `HtmlLang` | Correct lang on first byte; no client patch needed |
| 3 | Sitemap project slugs | `app/sitemap.ts` emits only `/en` and `/ru` | Also emits `/en/projects/{slug}` and `/ru/projects/{slug}` |
| 4 | Replace placeholders + add CV | `contactLinks.github` and `contactLinks.linkedin` contain `/placeholder`; `cv.pdf` absent from `public/` | Real URLs; actual PDF at `public/cv.pdf` |
| 5 | Production env | `.env.local` only has `localhost`; no CI/CD secrets template | `.env.production.example` documents every required var; CI injects them; build fails fast if missing |
| 6 | Server action rate-limit via Upstash | In-memory `Map` in `contact.ts` (resets on serverless cold-start, no shared state across instances) | Upstash Redis sliding-window via `@upstash/ratelimit`; graceful no-op if env vars absent |

---

## Item 1 — Locale auto-redirect at `/`

### Decision

Use a Next.js Edge Middleware (`middleware.ts` at repo root) rather than a catch-all page or `next.config.ts` redirects.

**Why middleware:**
- Runs at the CDN edge before any rendering, so no cold-start cost and no double-render.
- Can read both `Accept-Language` header and `NEXT_LOCALE` cookie in one place.
- Does not require touching `next.config.ts` `i18n` config (which is incompatible with App Router).

**Why NOT `next.config.ts` redirects:** Static redirect rules cannot inspect headers at runtime.

**Why NOT a root `page.tsx`:** Would incur an SSR render, adds a route to the bundle, and `notFound()` from there still emits a 404 before redirect.

### Algorithm

```
GET /
1. Read cookie NEXT_LOCALE → if "en" or "ru" → 307 /{locale}
2. Parse Accept-Language header → best-match against ["en","ru"] → 307 /{locale}
3. Fallback → 307 /en
```

Cookie is set (httpOnly: false, sameSite: lax, path: /, max-age: 1 year) when the user explicitly switches locale via `LocaleSwitcher`.

### Tradeoffs

| Option | Pro | Con |
|--------|-----|-----|
| Cookie-first, then header | Returning visitors get remembered locale immediately | First visit always header-driven; no geo-lookup |
| Header-first, then cookie | Fresh visits get preferred locale | Explicit user switch needs cookie write at switcher |
| Cookie + header (chosen) | Covers both new and returning visitors | Slightly more logic; cookie must be written by `LocaleSwitcher` |

### Files changed

- `middleware.ts` — new (root of repo, not inside `app/`)
- `components/LocaleSwitcher.tsx` — set `NEXT_LOCALE` cookie on click
- `middleware.ts` matcher — `"/"` only (must NOT match `/_next`, `/api`, static assets)

### Matcher config

```ts
export const config = {
  matcher: ["/"],
};
```

Intentionally narrow: all `/en/*` and `/ru/*` routes are already handled by `[locale]` segment.

### Acceptance criteria

- `GET /` with `Accept-Language: ru` → 307 `/ru` (no content rendered)
- `GET /` with `Accept-Language: en-US,en;q=0.9` → 307 `/en`
- `GET /` with cookie `NEXT_LOCALE=ru` and `Accept-Language: en` → 307 `/ru` (cookie wins)
- `GET /` with no header and no cookie → 307 `/en`
- `GET /en` is never redirected by middleware
- Redirect response has `Cache-Control: no-store` (personalised; must not be cached by CDN)

---

## Item 2 — SSR `<html lang>`

### Root cause

`app/layout.tsx` line 25:

```tsx
<html lang={defaultLocale} ...>
```

`defaultLocale` is the constant `"en"`. The `[locale]` segment cannot inject into the parent `html` element because Next.js App Router does not allow nested layout to mutate ancestor HTML attributes. `HtmlLang` (client component) patches `document.documentElement.lang` on mount — correct after JS hydration, wrong in the raw HTML stream (bad for screen readers, bots, and Lighthouse).

### Solution

Replace the static string with a **dynamic lookup derived from the URL segment** in `app/layout.tsx`.

`app/layout.tsx` is a server component. It has no `params` because it is the root layout. The locale can be read from the incoming request URL via `headers()`:

```ts
import { headers } from "next/headers";

const headerList = await headers();
const url = new URL(
  headerList.get("x-invoke-path") ?? headerList.get("x-pathname") ?? "/en",
  "http://x",
);
const segments = url.pathname.split("/");
const lang = locales.includes(segments[1] as Locale) ? segments[1] : defaultLocale;
```

**Note:** `x-invoke-path` is the internal Next.js header that carries the matched route pathname. Verify it is available in Next.js 16 on Vercel (it has been stable since v13.4). If not available on self-hosted, fall back to reading the `x-forwarded-prefix` or `x-pathname` header injected by middleware.

**Alternative (simpler, recommended):** Inject the locale as a custom header from middleware, then read it in `layout.tsx`:

```ts
// middleware.ts — after resolving locale, before returning:
const response = NextResponse.next();
response.headers.set("x-locale", locale);
return response;
```

```ts
// app/layout.tsx:
const lang = (await headers()).get("x-locale") ?? defaultLocale;
```

This is the recommended approach because it is explicit, not fragile to Next.js internals.

Once `lang` is correct server-side, `HtmlLang` can be removed entirely (it becomes redundant).

### Tradeoffs

| Approach | Pro | Con |
|----------|-----|-----|
| Middleware header injection (chosen) | Explicit, no URL parsing, works on any deployment | Middleware must run on every request (fine, it's edge) |
| Parse URL in `layout.tsx` | No middleware dependency | Brittle on Next.js header name changes |
| Keep `HtmlLang` | Zero changes | CLS jitter, wrong in SSR response, Lighthouse demerit |

### Files changed

- `middleware.ts` — set `x-locale` response header on every request (including `/{locale}/*`); matcher must be broadened to `"/:path*"` but skip `_next` and static assets
- `app/layout.tsx` — read `x-locale` from `headers()`, replace `lang={defaultLocale}` with `lang={lang}`
- `components/HtmlLang.tsx` — delete (or keep as no-op during transition)
- `app/[locale]/layout.tsx` — remove `<HtmlLang />` import and usage

### Acceptance criteria

- `curl -s https://{domain}/en | grep '<html'` → `lang="en"` present in raw bytes
- `curl -s https://{domain}/ru | grep '<html'` → `lang="ru"` present in raw bytes
- Playwright: `page.locator("html")` has attribute `lang` matching locale **without** waiting for JS (`page.waitForFunction` removed from test)
- Lighthouse accessibility score does not flag "document does not have a valid lang"

---

## Item 3 — Sitemap project slugs

### Current state

`app/sitemap.ts` returns only two entries: `/en` and `/ru`.

### Solution

Read project slugs at sitemap generation time using the existing `getProjectSlugs()` function from `lib/content.ts`. Emit `/{locale}/projects/{slug}` for each locale × slug combination.

```ts
import { getProjectSlugs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${base}/${locale}`, lastModified });
    for (const slug of slugs) {
      entries.push({ url: `${base}/${locale}/projects/${slug}`, lastModified });
    }
  }
  return entries;
}
```

**Note:** `sitemap.ts` has `export const revalidate = 3600`. This is a static export file — `revalidate` has no effect here since `sitemap.xml` is always a server-rendered route in App Router. It should be removed or replaced with `export const dynamic = "force-dynamic"` if slugs change at runtime (not the case here since content is file-system at build time). For a static site the slugs never change between deployments, so the sitemap can safely be static (`force-static`).

### Decision: `lastModified` per slug vs global

Current code uses a single `NEXT_PUBLIC_BUILD_DATE`. Per-slug modification dates would require reading each file's `mtime` — unnecessary complexity for a portfolio. Keep global build date.

### Tradeoffs

| Option | Pro | Con |
|--------|-----|-----|
| Global build date (chosen) | Simple; matches deploy cycle | Does not reflect individual content edits |
| Per-slug `fs.stat` mtime | Accurate | Extra I/O per slug; overkill for portfolio |

### Files changed

- `app/sitemap.ts`

### Acceptance criteria

- `GET /sitemap.xml` returns 14 entries (2 locales × (1 root + 6 project slugs))
- All URLs use `NEXT_PUBLIC_SITE_URL` base, no `example.com` in production
- `curl https://{domain}/sitemap.xml | xmllint --noout -` exits 0 (valid XML)
- Google Search Console can fetch and parse without errors after deploy

---

## Item 4 — Replace placeholders + add CV

### Audit of placeholders

| Location | Variable/string | Action |
|----------|----------------|--------|
| `app/[locale]/page.tsx:17` | `contactLinks.github = "https://github.com/placeholder"` | Replace with real GitHub URL |
| `app/[locale]/page.tsx:18` | `contactLinks.linkedin = "https://linkedin.com/in/placeholder"` | Replace with real LinkedIn URL |
| `app/[locale]/page.tsx:19` | `contactLinks.cv = "/cv.pdf"` | File must exist at `public/cv.pdf` |
| `locales/en.ts:44` | `"GitHub/LinkedIn/CV links are placeholders until updated."` | Remove or change to empty string once links are live |
| `locales/ru.ts` | Same string | Same |
| `lib/structured-data.ts` (check) | `sameAs` filter removes placeholder URLs | Will auto-resolve once real URLs are set |
| `app/[locale]/page.tsx:44` | `sameAs` filter `/placeholder/i` | Keep filter; remove once real URLs are in |

### CV PDF

- File: `public/cv.pdf`
- Filename must be stable across deploys (no hash suffix); served directly by Next.js static file handler.
- Recommended: export from Notion/Figma/Word → PDF. Name it exactly `cv.pdf`.
- Add `public/cv.pdf` to `.gitignore` if it contains personal data not suitable for the repo, and instead serve it from a CDN/Vercel Blob or via environment-driven redirect.

**Decision on CV in git:**
- Small PDF (< 1 MB) in `public/` is acceptable for a personal portfolio repo — no build bloat risk.
- If sensitive data, use Vercel Blob + a signed URL redirect (adds complexity; defer to post-launch).

### Files changed

- `app/[locale]/page.tsx` — update `contactLinks` object
- `locales/en.ts`, `locales/ru.ts` — update `placeholderNote`
- `public/cv.pdf` — add file

### Acceptance criteria

- `GET /cv.pdf` returns `200` with `Content-Type: application/pdf`
- GitHub and LinkedIn links return `200` on HEAD request (no redirect to placeholder)
- `placeholderNote` text is blank or removed from rendered page
- `sameAs` array in JSON-LD includes both social URLs

---

## Item 5 — Production environment

### Problem

Only `.env.local` exists (`NEXT_PUBLIC_SITE_URL=http://localhost:3000`). There is no template for what CI/CD needs, so deployers must guess. `app/sitemap.ts` and `app/robots.ts` already `throw` when `NEXT_PUBLIC_SITE_URL` is absent in production — good, but undocumented.

### Solution

Create `.env.production.example` (committed to git, no secrets) that documents every required and optional variable:

```bash
# === Required in production ===
NEXT_PUBLIC_SITE_URL=https://yoursite.com

# === Email delivery (Resend) ===
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_TO=you@example.com
CONTACT_FROM=Portfolio <hello@yoursite.com>    # optional, defaults to onboarding@resend.dev

# === Rate limiting (Upstash Redis) ===
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxxxx

# === Build metadata ===
NEXT_PUBLIC_BUILD_DATE=2026-03-16              # set by CI from git tag or date

# === SEO controls ===
NEXT_PUBLIC_NOINDEX=false                      # set to true on staging
```

### Build-time guard

Add a `lib/env.ts` module that validates required variables at startup and throws with a clear message if any are missing when `NODE_ENV === "production"`. Call it from `instrumentation.ts` (Next.js built-in startup hook):

```ts
// lib/env.ts
export function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const required = ["NEXT_PUBLIC_SITE_URL"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
```

```ts
// instrumentation.ts (Next.js 15+ feature)
export async function register() {
  const { assertProductionEnv } = await import("./lib/env");
  assertProductionEnv();
}
```

### CI: add Playwright and quality jobs for production env

Update `quality.yml`:
- Add `NEXT_PUBLIC_NOINDEX=true` on staging deploys
- Add `NEXT_PUBLIC_BUILD_DATE` from `$(date +%Y-%m-%d)`
- Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as GitHub Secrets, injected only on production deploy workflow (separate from the quality PR workflow)

### Files changed

- `.env.production.example` — new (committed)
- `lib/env.ts` — new
- `instrumentation.ts` — new (or add to existing if present)
- `.github/workflows/quality.yml` — add `NEXT_PUBLIC_BUILD_DATE`
- `AGENTS.md` or `README.md` — document required env vars

### Acceptance criteria

- `npm run build` with missing `NEXT_PUBLIC_SITE_URL` exits non-zero with a readable error message (not a cryptic Next.js build failure)
- `.env.production.example` contains every variable used in `process.env.*` across the codebase
- CI quality job passes with documented env vars injected as GitHub Actions secrets
- No secrets appear in `git log` or build output

---

## Item 6 — Server action rate-limit via Upstash

### Problem

Current `contact.ts` uses an in-memory `Map` for rate limiting:

```ts
const rateLimit = new Map<string, { count: number; resetAt: number }>();
```

**Two critical flaws:**
1. **Serverless reset:** Vercel Functions spawn new instances per request (or after cold starts). The Map is wiped on every cold start, so limits are not enforced across instances.
2. **No shared state:** Multiple concurrent instances each hold their own Map — a burst can hit all instances before any limit is reached.

### Solution

Replace with `@upstash/ratelimit` using a sliding window algorithm backed by Upstash Redis.

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "cv:contact",
});
```

**Graceful degradation:** If `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` are absent (local dev, CI), fall back to the existing in-memory Map rather than throwing. This keeps local dev and CI working without Redis.

```ts
async function isRateLimited(clientId: string): Promise<boolean> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return isRateLimitedInMemory(clientId); // existing logic, renamed
  }
  const { success } = await ratelimit.limit(clientId);
  return !success;
}
```

### Tradeoffs

| Option | Pro | Con |
|--------|-----|-----|
| In-memory Map (current) | Zero dependencies, free | Resets on cold start; doesn't work across instances |
| Upstash Redis sliding window (chosen) | Shared across instances, persistent, free tier (10k req/day) | Requires external service; latency ~5–15ms per form submit |
| Vercel KV (same as Upstash under the hood) | Vendor integration | Vercel lock-in; same latency |
| No rate limiting | Simple | Open to abuse |

**Upstash free tier** covers ~10k requests/day, which is more than sufficient for a portfolio contact form.

### Sliding window vs fixed window

Sliding window prevents the "boundary burst" attack (where an attacker sends 5 requests at 09:59 and 5 more at 10:01, bypassing a fixed 10-minute window). Chosen accordingly.

### Files changed

- `app/actions/contact.ts` — replace in-memory rate limit with Upstash, with fallback
- `package.json` — add `@upstash/ratelimit` and `@upstash/redis`
- `.env.production.example` — already included above

### Acceptance criteria

- Sending 6 form submissions from the same IP within 10 minutes from a fresh serverless instance returns `error: "rate"` on the 6th
- Local dev without Upstash env vars still rate-limits (in-memory fallback)
- Upstash dashboard shows requests counted correctly after production deploy
- No unhandled promise rejection if Upstash is unreachable (wrap in try/catch, fall back to in-memory)

---

## Sequencing and dependencies

```
[4] Placeholders + CV          ← no deps; do first (content-only)
[5] Production env             ← no deps; do in parallel with [4]
[1] Middleware redirect        ← no deps; can do in parallel with [4,5]
[2] SSR html lang              ← depends on [1] (middleware injects x-locale header)
[3] Sitemap slugs              ← no deps; can do at any time
[6] Upstash rate limit         ← depends on [5] (env vars documented)
```

Recommended order:

```
Sprint 1 (content + env, 1–2 h):  [4] → [5]
Sprint 2 (routing, 2–3 h):        [1] → [2]
Sprint 3 (SEO + infra, 1–2 h):    [3] + [6]
```

Total estimated effort: **6–8 hours**.

---

## Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `x-locale` header not forwarded on self-hosted Next.js | Low | Medium | Test locally with `next start`; add integration test; fallback to URL parsing in `layout.tsx` |
| Upstash Redis cold-start adds latency to form submit | Medium | Low | <15ms over HTTP/2; acceptable for a contact form; show "Sending…" UX |
| PDF in git causes repo bloat | Low | Low | Keep CV ≤ 1 MB; add to separate Vercel Blob if > 1 MB |
| Sitemap grows stale if slugs added between deploys | Low | Low | `NEXT_PUBLIC_BUILD_DATE` is set per deploy; sitemap reflects build state |
| `Accept-Language` parsing gets complex edge cases (e.g., `zh-Hant-TW`) | Low | Low | Use simple substring match; worst case defaults to `"en"` |
| Middleware breaks existing Playwright tests that navigate to `/en` directly | None | None | Middleware matcher is `"/"` only; `/en` is not matched |
| Removing `HtmlLang` causes regression in locale switching | Low | Medium | Keep `HtmlLang` until SSR lang is verified in Playwright without `waitForFunction` |

---

## Tests to add / modify

### Unit / integration

| File | Test | Trigger |
|------|------|---------|
| `middleware.ts` | Accept-Language header parsing returns correct locale | Jest or vitest unit test on the pure parse function |
| `middleware.ts` | Cookie `NEXT_LOCALE=ru` beats Accept-Language `en` | Same |
| `app/sitemap.ts` | Returns entries for all locales × slugs | Import and call in test; snapshot |
| `lib/env.ts` | Throws when `NODE_ENV=production` and var missing | Unit |

### E2E (Playwright)

| Test | File | Change |
|------|------|--------|
| `GET /` redirects to `/en` with neutral Accept-Language | `locale-routing.spec.ts` | New test |
| `GET /` with `Accept-Language: ru` redirects to `/ru` | `locale-routing.spec.ts` | New test (requires setting header via `page.setExtraHTTPHeaders`) |
| `<html lang>` correct **before JS hydration** | `locale-routing.spec.ts` | Remove `waitForFunction`; assert immediately after `goto` |
| Sitemap XML is valid and contains project slugs | New `sitemap.spec.ts` | `page.goto("/sitemap.xml")` + text assertion |
| `GET /cv.pdf` returns 200 | New `assets.spec.ts` | `request.get("/cv.pdf")` |
| Rate limit: 6th submission returns rate error | `locale-routing.spec.ts` | New, only runs in environments with mocked Upstash |

---

## Measurable acceptance criteria (production checklist)

Before marking any item ✅ done, all criteria for that item must pass.

| # | Check | How to verify |
|---|-------|--------------|
| 1a | `curl -I https://{domain}/` shows `HTTP/2 307` and `Location: https://{domain}/ru` when run with `-H "Accept-Language: ru"` | Manual curl |
| 1b | `curl -I https://{domain}/` shows `Location: .../en` with no Accept-Language | Manual curl |
| 1c | Playwright: redirect test passes in CI | `npm run test:e2e` |
| 2a | `curl -s https://{domain}/ru \| grep 'lang="ru"'` exits 0 | Manual curl |
| 2b | Lighthouse accessibility ≥ 95 (no lang error) | `npm run lhci` |
| 2c | Playwright lang test passes without `waitForFunction` | `npm run test:e2e` |
| 3a | `curl https://{domain}/sitemap.xml \| grep '/projects/'` shows ≥ 6 slug entries | Manual curl |
| 3b | Google Search Console → Sitemap → "Submitted URLs" = 14 | GSC dashboard |
| 4a | `curl -I https://{domain}/cv.pdf` → `200 application/pdf` | Manual curl |
| 4b | GitHub and LinkedIn links return `2xx` or `3xx` to real profile | Manual click |
| 4c | `placeholderNote` text absent from rendered HTML | `curl \| grep placeholder` exits 1 |
| 5a | `NEXT_PUBLIC_SITE_URL=` (empty) `npm run build` fails with readable message | Local test |
| 5b | `.env.production.example` committed and up-to-date | `git log` |
| 5c | No real secrets in git history | `git secrets --scan` or `trufflehog` |
| 6a | 6th contact form POST in 10 min returns `{"error":"rate"}` in production | Postman/curl |
| 6b | Local dev (no Upstash vars) form submit succeeds on first request | Manual |
| 6c | Upstash dashboard shows key `cv:contact:{ip}` incrementing | Upstash console |
