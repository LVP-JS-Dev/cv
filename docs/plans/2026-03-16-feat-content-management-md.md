---
title: "feat: MD Content Management"
type: feat
status: active
date: 2026-03-16
origin: 2026-03-13-feat-senior-frontend-portfolio-site-plan.md
---

# feat: MD Content Management

## Overview
Replace hardcoded TypeScript content objects with a git-native Markdown content management system (CMS) to support localized case studies, experience history, and future technical articles. This transition enables richer narrative content beyond bullet points while maintaining performance and type safety.

### Research Insights
- Use `gray-matter` for frontmatter parsing and `next-mdx-remote` for MDX body rendering to support interactive code samples later.
- Store localized versions alongside each other: `content/projects/{slug}/{locale}.md` to group assets with content.
- Cache content reads in the data-fetching layer to avoid redundant disk I/O on large layouts.

### Implementation Notes
- Keep the current UI components but adapt them to render MD body sections.
- For v1, continue using frontmatter arrays for `tech`, `outcomes`, etc., to minimize UI rework, but allow the body to contain the full narrative.

## Proposed Solution

### 1. File Structure
```
content/
├── projects/
│   ├── biometric-kyc-liveness/
│   │   ├── en.md
│   │   └── ru.md
│   └── ai-audio-cleanup-site/
│       ├── en.md
│       └── ru.md
└── experience/
    ├── void0/
    │   ├── en.md
    │   └── ru.md
    └── latoken/
        ├── en.md
        └── ru.md
```

### 2. Frontmatter Schema (Projects)
```yaml
title: string
role: string
period: string
summary: string
impact: string
tech: string[]
industry: string
anonymous: boolean
links: { label: string, href: string }[]
```

### 3. Body Content
Use standard Markdown for the body. The `ProjectDetailPage` will render this body as the primary narrative.

### 4. Technical Stack
- `gray-matter`: Frontmatter parsing.
- `next-mdx-remote`: Server-side MDX rendering.
- `glob`: For finding content files.

## Transition Steps
1. **Scaffold Directory Structure**: Create `content/projects` and `content/experience`.
2. **Implement Content Library**: Create `lib/content.ts` with `getProjects(locale)`, `getExperience(locale)`, and `getProjectBySlug(slug, locale)`.
3. **Migrate Content**: Port `content/projects.ts` and `content/experience.ts` to individual MD files (EN/RU).
4. **Update Routes**:
   - `app/[locale]/page.tsx`: Fetch projects and experience via `lib/content.ts`.
   - `app/[locale]/projects/[slug]/page.tsx`: Fetch project detail via `lib/content.ts` and render MDX body.
5. **Clean up**: Remove `content/projects.ts` and `content/experience.ts`.

## Acceptance Criteria
- [ ] Content is sourced from `.md` files in `content/` directory.
- [ ] All projects and experience entries have RU and EN versions.
- [ ] MD body is rendered correctly on project detail pages.
- [ ] Performance (Lighthouse) remains stable after switching to file-system reads.
- [ ] All current project slugs are preserved to maintain link integrity.
