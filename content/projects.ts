/**
 * External or internal link displayed on a project case study.
 */
export type ProjectLink = {
  label: string;
  href: string;
};

/**
 * Case study metadata and narrative content for project detail pages.
 */
export type Project = {
  title: string;
  slug: string;
  summary: string;
  impact: string;
  tech: string[];
  period: string;
  role: string;
  overview: string[];
  outcomes: string[];
  challenges: string[];
  stackNotes: string[];
  industry?: string;
  anonymous?: boolean;
  links: ProjectLink[];
};

/**
 * Curated list of projects shown on the homepage and detail pages.
 */
export const contentProjects: Project[] = [
  {
    title: "Biometric KYC / Liveness Verification",
    slug: "biometric-kyc-liveness",
    role: "Senior Fullstack Developer",
    period: "2024 — 2025",
    summary:
      "Built an iframe widget with cross-browser getUserMedia support and optimized real-time video streaming over WebSocket.",
    impact: "Latency 250ms → 150ms • 95%+ success rate",
    tech: ["React", "TypeScript", "WebSocket", "MediaStream"],
    overview: [
      "Designed a secure in-app verification flow for high-volume onboarding.",
      "Embedded the experience via iframe to fit multiple partner products.",
    ],
    outcomes: [
      "Reduced streaming latency while improving verification completion.",
      "Raised success rate with clearer guidance and real-time feedback.",
    ],
    challenges: [
      "Cross-browser MediaStream support and permissions UX.",
      "Consistent video quality over variable network conditions.",
    ],
    stackNotes: [
      "Used WebSocket backpressure handling to stabilize streams.",
      "Added PostMessage bridge for host app integration.",
    ],
    industry: "Fintech identity",
    anonymous: true,
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    title: "AI Audio Cleanup Marketing Site",
    slug: "ai-audio-cleanup-site",
    role: "Senior Fullstack Developer",
    period: "2024",
    summary:
      "Delivered a Next.js landing page with interactive waveform comparison and automated CI/CD deployment.",
    impact: "PageSpeed 95+ mobile",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "CI/CD"],
    overview: [
      "Built a performance-first marketing site with product storytelling.",
      "Interactive before/after audio player to prove quality.",
    ],
    outcomes: [
      "Achieved strong mobile performance scores and fast load times.",
      "Improved conversion via clearer product differentiation.",
    ],
    challenges: [
      "Rendering audio waveforms efficiently on mobile devices.",
      "Balancing media-rich content with performance budgets.",
    ],
    stackNotes: [
      "Optimized assets with Next.js image and font tooling.",
      "Automated deployments via CI/CD pipelines.",
    ],
    industry: "AI SaaS",
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    title: "Mobile Credit Application Flow",
    slug: "mobile-credit-application",
    role: "Senior Frontend Developer",
    period: "2023",
    summary:
      "Implemented a WebView-ready React flow for a banking credit product and maintained a shared UI library.",
    impact: "12+ shared components across 5+ products",
    tech: ["React", "TypeScript", "Redux", "Webpack"],
    overview: [
      "Built a multi-step credit application inside mobile WebViews.",
      "Aligned UX with internal design system and compliance rules.",
    ],
    outcomes: [
      "Reusable component library adopted by multiple teams.",
      "Shorter time-to-release for new credit flows.",
    ],
    challenges: [
      "Handling WebView constraints on iOS and Android.",
      "Legacy migration from class components to hooks.",
    ],
    stackNotes: [
      "Introduced memoization to reduce re-renders.",
      "Improved build times by tuning Webpack config.",
    ],
    industry: "Banking",
    anonymous: true,
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    title: "HR Meetings Analytics Platform",
    slug: "hr-meetings-analytics",
    role: "Lead Development Engineer",
    period: "2022",
    summary:
      "Led a web + mobile experience for HR meeting analytics and shipped an admin panel for operations teams.",
    impact: "Unified web + mobile UX",
    tech: ["React", "React Native", "TypeScript", "Node.js"],
    overview: [
      "Unified web and mobile experience for HR analytics workflows.",
      "Delivered admin tooling for HR operations visibility.",
    ],
    outcomes: [
      "Consistent UX across platforms and reduced training overhead.",
      "Clear analytics views for decision makers.",
    ],
    challenges: [
      "Coordinating releases across web and mobile clients.",
      "Building analytics UI on top of legacy APIs.",
    ],
    stackNotes: [
      "Shared UI patterns between React and React Native.",
      "Maintained >80% test coverage on core flows.",
    ],
    industry: "HR Tech",
    anonymous: true,
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    title: "Corporate Banking Onboarding",
    slug: "corporate-banking-onboarding",
    role: "JavaScript Developer",
    period: "2021",
    summary:
      "Built onboarding flows for legal entities and added Cypress E2E coverage for critical scenarios.",
    impact: "Initial load time -40%",
    tech: ["React", "Redux", "Redux-Saga", "Cypress"],
    overview: [
      "Implemented onboarding flows for legal entities in a banking portal.",
      "Added E2E regression coverage for critical scenarios.",
    ],
    outcomes: [
      "Faster onboarding with improved initial load time.",
      "Higher confidence in releases via E2E coverage.",
    ],
    challenges: [
      "Optimizing bundle size without breaking legacy flows.",
      "Coordinating front-end changes with backend requirements.",
    ],
    stackNotes: [
      "Introduced code splitting for initial load reduction.",
      "Built Cypress suites for onboarding flows.",
    ],
    industry: "Enterprise banking",
    anonymous: true,
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    title: "Internal CRM Metrics Dashboard",
    slug: "internal-crm-metrics",
    role: "Fullstack Developer",
    period: "2020",
    summary:
      "Built internal CRM analytics dashboards and a BFF layer to power sales operations.",
    impact: "Improved metrics visibility",
    tech: ["React", "Node.js", "Express", "TypeScript"],
    overview: [
      "Created dashboards for sales operations and CRM analytics.",
      "Implemented a BFF layer to simplify data access.",
    ],
    outcomes: [
      "Faster reporting cycles with centralized metrics.",
      "Improved visibility across sales funnels.",
    ],
    challenges: [
      "Aggregating metrics from multiple services.",
      "Maintaining performance with growing datasets.",
    ],
    stackNotes: [
      "Built REST-based BFF for consistent data access.",
      "Optimized dashboard rendering for large tables.",
    ],
    industry: "SaaS CRM",
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
];
