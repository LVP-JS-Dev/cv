---
module: System
date: 2026-03-16
problem_type: build_error
component: documentation
symptoms:
  - "npm run build failed while prerendering /en"
  - "YAMLException: end of the stream or a document separator is expected at line 6, column 1"
root_cause: config_error
resolution_type: documentation_update
severity: critical
tags: [markdown, frontmatter, gray-matter, yaml, build-error]
---

# Troubleshooting: YAML frontmatter parsing breaks Next.js build

## Problem
Next.js build failed after adding Markdown bodies to project content files because the YAML frontmatter was no longer a valid top-of-file block.

## Environment
- Module: System
- Rails Version: N/A
- Affected Component: Documentation (content markdown + gray-matter loader)
- Date: 2026-03-16

## Symptoms
- npm run build failed while prerendering /en
- YAMLException: end of the stream or a document separator is expected at line 6, column 1

## What Didn't Work

**Direct solution:** The problem was identified and fixed on the first attempt.

## Solution

Move YAML frontmatter to the top of each content file and place Markdown body after the closing `---`. The failure was triggered by Markdown headings and list items being placed inside the frontmatter block.

**Code changes** (example):
```markdown
# Before (broken):
---
## Context
- Performance-first layout and asset strategy
title: "AI Audio Cleanup Marketing Site"
slug: "ai-audio-cleanup-site"
---

# After (fixed):
---
title: "AI Audio Cleanup Marketing Site"
slug: "ai-audio-cleanup-site"
---

## Context
- Performance-first layout and asset strategy
```

**Commands run**:
```bash
npm run build
```

## Why This Works

Gray-matter expects a valid YAML frontmatter block at the very top of the file, bounded by `---` separators. When Markdown content appears before the closing separator, the YAML parser reads it as part of the frontmatter and fails. Restoring the correct frontmatter structure allows the parser to load metadata and treat the remaining content as the Markdown body.

## Prevention

- Keep frontmatter at the very top of every content file; only Markdown body goes below the closing `---`.
- Add a CI check or script that parses all `content/**/*.md` files with gray-matter.
- Use editor snippets or templates to avoid mixing Markdown body inside frontmatter.

## Related Issues

No related issues documented yet.
