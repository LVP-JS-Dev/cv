---
title: "NDA Content Review Checklist"
date: 2026-03-16
status: active
---

# NDA Content Review Checklist

Use this checklist before publishing any portfolio content derived from confidential work.

## Identity & Naming
- Project titles do not include client or product names.
- Slugs avoid client, product, or internal system identifiers.
- Company names and logos are not present in text or images.
- Team or vendor names are removed unless explicitly cleared.

## Content Details
- Metrics are aggregated or rounded (no sensitive exact figures).
- Dates are coarse (year or range), not exact launch dates.
- Architecture descriptions avoid internal hostnames, APIs, or repos.
- Screenshots are either mocked or fully sanitized.
- Links do not point to private systems or internal docs.

## Frontmatter Guardrails
- `anonymous: true` is set for NDA-bound projects.
- `industry` is present to keep the summary meaningful without names.
- `links` are either placeholders or public.

## Language & Tone
- Avoid mentioning specific stakeholders or client roles.
- Avoid revealing contractual constraints or compliance details.
- Keep descriptions at feature-level, not proprietary implementation details.

## Final Review
- Read the page as an external reviewer; no unique identifiers remain.
- Confirm RU and EN variants are aligned and equally sanitized.
- If uncertain, remove details or replace with a generic statement.
