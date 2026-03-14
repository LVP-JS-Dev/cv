/**
 * External label/url pair used for project call-to-action links.
 */
export type ProjectLink = {
  label: string;
  href: string;
};

/**
 * Describes the structured data for a single highlighted project.
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  impact: string;
  tech: string[];
  stackNotes: string[];
  overview: string[];
  outcomes: string[];
  challenges: string[];
  period: string;
  role: string;
  anonymous?: boolean;
  industry?: string;
  links: ProjectLink[];
};

/**
 * Curated list of portfolio projects surfaced on the site.
 */
export const contentProjects: Project[] = [
  {
    slug: "biometric-kyc",
    title: "Biometric KYC / Liveness Verification",
    role: "Senior Fullstack Developer",
    period: "2024 — 2025",
    summary:
      "Built an iframe widget with cross‑browser getUserMedia support and optimized real‑time video streaming over WebSocket.",
    impact: "Latency 250ms → 150ms • 95%+ success rate",
    industry: "Fintech",
    tech: ["React", "TypeScript", "WebSocket", "MediaStream"],
    overview: [
      "Shard-safe iframe adapter for remote verification flows across partner portals.",
      "Custom media capture stack with retries for low-end browsers and payment desks.",
      "Server-side WebSocket pipeline with RTP muxing to comply with security policies.",
    ],
    outcomes: [
      "Latency reduced from ~250ms to 150ms on average, increasing conversion.",
      "95%+ verification success despite spotty connectivity through defensive buffering.",
      "Auditable streams that satisfied internal fraud and compliance reviews.",
    ],
    challenges: [
      "Ensuring getUserMedia support inside diverse iframe hosts with restrictive CSP.",
      "Adapting to mobile carriers that aggressively throttle WebSocket traffic.",
      "Coordinating with ops on securing sensitive biometric assets in flight and at rest.",
    ],
    stackNotes: [
      "WebSocket pipeline with adaptive frame rates to stay within detection thresholds.",
      "MediaStream polyfills for legacy Safari and embedded WebView shells.",
    ],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    slug: "ai-audio-cleanup",
    title: "AI Audio Cleanup Marketing Site",
    role: "Senior Fullstack Developer",
    period: "2024",
    summary:
      "Delivered a Next.js landing page with interactive waveform comparison and automated CI/CD deployment.",
    impact: "PageSpeed 95+ mobile",
    industry: "Audio",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "CI/CD"],
    overview: [
      "Crafted live waveform comparators with Harmony.js and custom Web Audio graph nodes.",
      "Iterated on SEO copies with analytics-backed copy testing to match brand tone.",
    ],
    outcomes: [
      "PageSpeed Insights scores improved to 95+ on mobile and desktop.",
      "Automated CI/CD tests and visual regression guardrails added before promo pushes.",
    ],
    challenges: [
      "Keeping interactive audio previews performant while maintaining responsive layout.",
      "Integrating third-party marketing APIs without bloating the main bundle.",
    ],
    stackNotes: [
      "Dynamic imports and layout shifts avoided with explicit width/height hints.",
      "CI scripts run on CircleCI with Storybook snapshots for marketing content blocks.",
    ],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    slug: "mobile-credit-flow",
    title: "Mobile Credit Application Flow",
    role: "Senior Frontend Developer",
    period: "2023",
    summary:
      "Implemented a WebView-ready React flow for a banking credit product and maintained a shared UI library.",
    impact: "12+ shared components across 5+ products",
    industry: "Fintech",
    tech: ["React", "TypeScript", "Redux", "Webpack"],
    anonymous: true,
    overview: [
      "Ported the progressive balance sheet walkthrough to work inside multiple banking WebViews.",
      "Standardized the shared component library and enforced theming via CSS variables.",
    ],
    outcomes: [
      "Platform stability improved for 5+ localized customers thanks to the shared flow.",
      "Design tokens adoption across mobile and web teams reduced duplication.",
    ],
    challenges: [
      "Handling frequent WebView memory resets without losing user progress.",
      "Synchronizing Redux state between native containers and the React flow.",
    ],
    stackNotes: [
      "Redux middleware bridged native messaging and web interactions.",
      "Webpack builds optimized for low-memory class devices at the time.",
    ],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    slug: "hr-analytics-platform",
    title: "HR Meetings Analytics Platform",
    role: "Lead Development Engineer",
    period: "2022",
    summary:
      "Led a web + mobile experience for HR meeting analytics and shipped an admin panel for operations teams.",
    impact: "Unified web + mobile UX",
    industry: "HR Tech",
    tech: ["React", "React Native", "TypeScript", "Node.js"],
    anonymous: true,
    overview: [
      "Coordinated shared component library across web and React Native shells.",
      "Designed analytics dashboards and embedded mobile widgets for HR teams.",
    ],
    outcomes: [
      "Shipment of cohesive HR meeting analytics dashboards for hybrid products.",
      "Reduced onboarding friction for ops with a unified admin experience.",
    ],
    challenges: [
      "Balancing analytics density with mobile display constraints.",
      "Maintaining sync between mobile-native and web-specific reporting views.",
    ],
    stackNotes: [
      "Node.js APIs served combined analytics from mobile and web sources.",
      "Shared design tokens ensured parity between React and React Native styles.",
    ],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    slug: "corporate-onboarding",
    title: "Corporate Banking Onboarding",
    role: "JavaScript Developer",
    period: "2021",
    summary:
      "Built onboarding flows for legal entities and added Cypress E2E coverage for critical scenarios.",
    impact: "Initial load time -40%",
    industry: "Banking",
    tech: ["React", "Redux", "Redux-Saga", "Cypress"],
    anonymous: true,
    overview: [
      "Delivered entity onboarding journeys with multi-step identity verification.",
      "Automated testing in Cypress guarding regulatory scenarios.",
    ],
    outcomes: [
      "Initial load time cut by 40% improving first impression metrics.",
      "End-to-end coverage for risk-sensitive flows and audit support.",
    ],
    challenges: [
      "Coordinating secure data handling during onboarding with compliance teams.",
      "Keeping progressive onboarding performant across countries with strict CSP.",
    ],
    stackNotes: [
      "Redux-Saga orchestrated remote validation calls and retries.",
      "Cypress suites captured critical regression paths for legal teams.",
    ],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    slug: "crm-metrics-dashboard",
    title: "Internal CRM Metrics Dashboard",
    role: "Fullstack Developer",
    period: "2020",
    summary:
      "Built internal CRM analytics dashboards and a BFF layer to power sales operations.",
    impact: "Improved metrics visibility",
    industry: "SaaS",
    tech: ["React", "Node.js", "Express", "TypeScript"],
    overview: [
      "Built React dashboards with data visualizations and contextual insights for ops.",
      "Delivered BFF services aggregating CRM metrics from multiple data sources.",
    ],
    outcomes: [
      "Operations teams gained unified visibility into CRM performance.",
      "Dashboard refresh times improved with strategic caching.",
    ],
    challenges: [
      "Sourcing consistent metrics from legacy CRM APIs.",
      "Balancing real-time pushes with strict SLA constraints.",
    ],
    stackNotes: [
      "Express BFF normalized disparate CRM endpoints into GraphQL-like responses.",
      "React charts rendered with memoized selectors to avoid re-renders.",
    ],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
];
