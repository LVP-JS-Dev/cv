---
title: "Tag-based release pipeline: Next.js standalone → GHCR → Dokploy"
date: 2026-03-16
status: resolved
tags: [release, docker, ghcr, dokploy, github-actions, nextjs, standalone, ci-cd]
commits: [3e9e255, 4f6d1a2]
scope: Dockerfile · next.config.ts · .github/workflows/release.yml · docs/brainstorms/2026-03-16-release-by-tag-dokploy-ghcr-brainstorm.md
---

## Problem / Symptom

No automated path existed from a version tag to a running production container.
Deployments had to be triggered manually, there was no pre-deploy test gate, and
no immutable image record was kept per release. The VPS was expected to build the
app itself, which ties expensive compute to the host and makes rollbacks hard.

## Investigation

The brainstorm (`docs/brainstorms/2026-03-16-release-by-tag-dokploy-ghcr-brainstorm.md`)
established the following constraints:

- Builds must happen in CI, not on the VPS, to keep the host free and images
  reproducible.
- Releases must be production-only and triggered exclusively by a semver Git tag
  (`v*.*.*`), so every pushed tag maps 1-to-1 to a deployable artifact.
- The image registry should be GHCR because authentication reuses the existing
  `GITHUB_TOKEN` — no extra registry credentials are required for push.
- Dokploy must be told which exact image tag to run via its REST API before the
  deploy call, so the `:vX.Y.Z` tag (not `:latest`) is pinned per release.

Two open questions from the brainstorm were resolved during implementation:
1. **Exact tag vs. `:latest`** — exact tag chosen; Dokploy's `application.update`
   call sets `dockerImage` to the specific `:vX.Y.Z` digest before deploy.
2. **Dockerfile existence** — a new multi-stage Dockerfile was added alongside
   `output: "standalone"` in `next.config.ts`.

## Root Cause

Three pieces were missing and had to be created together:

1. `next.config.ts` did not set `output: "standalone"`, so Next.js emitted a
   full `node_modules`-dependent build that cannot be packaged into a minimal
   Docker image.
2. No `Dockerfile` existed to produce a container image from the standalone
   output.
3. No GitHub Actions workflow existed to orchestrate test → build → push → deploy
   on a tag push.

Without all three, any one piece alone is inoperable.

## Working Fix

### 1. `next.config.ts` — enable standalone output

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // ...rest unchanged
};
```

This instructs Next.js to emit `.next/standalone/` — a self-contained
`server.js` plus only the node modules it actually imports, ready to be copied
into an image without `node_modules` from the repo root.

### 2. `Dockerfile` — three-stage build

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

- **deps** — installs locked dependencies in isolation so layer cache is not
  busted by source changes.
- **builder** — compiles the Next.js app; the standalone output lands in
  `.next/standalone/`.
- **runner** — copies only the three directories needed at runtime; the final
  image carries no build tooling.

### 3. `.github/workflows/release.yml` — tag-triggered pipeline

Trigger: `push` on tags matching `v*.*.*`.

Permissions: `contents: read`, `packages: write` (minimum required for GHCR
push via `GITHUB_TOKEN`).

Steps in order:

| Step | Tool / command | Notes |
|---|---|---|
| Checkout | `actions/checkout@v4` | |
| Node setup | `actions/setup-node@v4` (Node 20) | |
| Install deps | `npm ci` | |
| Install Playwright | `npx playwright install --with-deps` | browsers + OS deps |
| **Run tests** | `npm run test:e2e` + `npm run test:axe` | gate before any artifact is built |
| GHCR login | `docker/login-action@v3` | username = `github.actor`, password = `secrets.GITHUB_TOKEN` |
| Build & push image | `docker/build-push-action@v5` | tag = `ghcr.io/<repo>:<git-tag>` |
| Dokploy update | `curl POST .../api/application.update` | sets `dockerImage` to the exact new tag |
| Dokploy deploy | `curl POST .../api/application.deploy` | fires the actual container swap |

Secrets referenced (must be configured in repository Settings → Secrets):

| Secret | Purpose |
|---|---|
| `GITHUB_TOKEN` | Auto-injected; used for GHCR push |
| `DOKPLOY_URL` | Base URL of the Dokploy instance |
| `DOKPLOY_API_KEY` | API key sent as `x-api-key` header to Dokploy's API |
| `DOKPLOY_APPLICATION_ID` | Dokploy internal ID of the application to deploy |

## Prevention / Tests

Tests (`test:e2e` — Playwright, `test:axe` — axe-playwright accessibility) run
as an explicit **gate step inside the release workflow** before any Docker build
or push occurs. A test failure aborts the pipeline and no image is published or
deployed.

**No local test execution is expected or required** — the workflow is the sole
test runner for release validation. Local runs are optional during development.

To verify the pipeline end-to-end, push a semver tag:

```bash
git tag v0.1.0 && git push origin v0.1.0
```

Check the Actions run, then confirm the image appears at
`ghcr.io/<owner>/<repo>/pkgs/container/<repo>` and that Dokploy shows the new
container running.

## Links

- Workflow: `.github/workflows/release.yml`
- Dockerfile: `Dockerfile`
- Next.js config change: `next.config.ts` (`output: "standalone"`)
- Brainstorm: `docs/brainstorms/2026-03-16-release-by-tag-dokploy-ghcr-brainstorm.md`
- Next.js standalone docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- Dokploy API reference: `<DOKPLOY_URL>/swagger` (available on any Dokploy instance)
- GHCR publishing guide: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
