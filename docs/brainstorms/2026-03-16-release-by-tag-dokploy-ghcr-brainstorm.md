---
date: 2026-03-16
topic: release-by-tag-dokploy-ghcr
---

# Release by Tag with GitHub Actions + GHCR + Dokploy

## What We're Building
Set up a production-only release workflow that deploys on Git tag pushes (format `vX.Y.Z`). GitHub Actions will build and test the app, publish a Docker image to GHCR, and trigger a Dokploy deployment to a VPS. Dokploy will run the new image and serve production traffic.

## Why This Approach
Building in CI keeps the VPS free from build load, ensures images are reproducible, and allows pre-deploy testing. Using tagged releases gives clean rollbacks and traceability. GHCR is already tied to GitHub, so auth and image access are straightforward.

## Key Decisions
- Release trigger: Git tag push `v*.*.*` only (production deploys only).
- Build location: GitHub Actions (not on VPS).
- Image registry: GHCR (`ghcr.io/<owner>/<repo>`).
- Deployment trigger: Dokploy API via `DOKPLOY_API_KEY` + `applicationId`.
- Secrets: stored in GitHub Actions (Dokploy API key, app id, Dokploy URL, GHCR credentials if needed).

## Open Questions
- Should Dokploy deploy the exact tag image (`:vX.Y.Z`) or track a `:latest` tag?
- Do we need a Dockerfile for the Next.js app, or will we add one as part of the plan?

## Next Steps
→ `/ce:plan-plus` for implementation details
