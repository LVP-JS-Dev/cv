---
date: 2026-03-13
topic: senior-frontend-portfolio
---

# Senior Frontend Portfolio Site

## What We're Building
A bilingual (RU/EN) personal portfolio site for a Senior Frontend Engineer that quickly communicates value to recruiters and tech leads while demonstrating depth in architecture, performance, accessibility, and DX. The site should showcase 4-6 case studies, highlight engineering quality, and provide a clear contact path (primary CTA: Telegram). It must be scalable to include future content without restructuring the core information architecture.

## Why This Approach
The combined goal (hiring + personal brand) is best served by a hiring-first narrative with strong engineering depth and a light, playful layer for personality. The structure should draw from Brittany Chiang (clean, fast scan), Sara Soueidan (engineering credibility), and Adam Hartwig (micro-interactions) while remaining readable and recruiter-friendly. This balances quick evaluation with deeper proof for technical stakeholders.

## Key Decisions
- Primary audience: recruiters and tech leads; secondary: broader personal brand.
- Core sections: Hero, About, Experience, Selected Projects, Engineering Quality, Content/Writing, Contact CTA.
- Case studies: 4-6, balanced focus (business impact + technical depth), partial anonymization where required.
- Localization: RU + EN.
- CTA: Email primary; support links to Telegram, GitHub, LinkedIn, CV.
- Quality targets: Lighthouse >= 90, SEO-friendly metadata, and content structured for future expansion.
- Technical constraints captured as requirements: Next.js App Router + TypeScript, Tailwind CSS, Motion for animations, optional 3D playground, deployable on Vercel with Docker option.
- Content readiness: resume updated 2026-03-13 is available as a primary source; initial placeholders are acceptable.

## Open Questions
- None.

## Resolved Questions
- Primary CTA set to email based on resume preference.

## Next Steps
→ `/ce:plan` for implementation details
