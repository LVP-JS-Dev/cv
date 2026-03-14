export type ExperienceLink = {
  label: string;
  href: string;
};

export type Experience = {
  title: string;
  summary: string;
  impact: string;
  tech: string[];
  period: string;
  role: string;
  anonymous?: boolean;
  links: ExperienceLink[];
};

export const contentExperience: Experience[] = [
  {
    title: "Void0",
    role: "Senior Fullstack Developer",
    period: "Dec 2024 — Present",
    summary:
      "Built biometric KYC/liveness flows, optimized real-time video streaming, and improved verification UX with lighting guidance and progress feedback.",
    impact: "Verification success 95%+ • Latency -40%",
    tech: ["React", "TypeScript", "WebSocket", "MediaStream", "PostMessage"],
    links: [],
  },
  {
    title: "Banking credit product (anonymous)",
    role: "Senior Frontend Developer",
    period: "Dec 2022 — Nov 2024",
    summary:
      "Delivered a mobile WebView credit application flow, maintained an internal UI library (12+ components), and refactored legacy class components to hooks.",
    impact: "Build time 4.5 → 2.1 min",
    tech: ["React", "TypeScript", "Redux", "Jest", "Webpack"],
    anonymous: true,
    links: [],
  },
  {
    title: "Large bank HR platform (anonymous)",
    role: "Lead Development Engineer",
    period: "Sep 2021 — Oct 2022",
    summary:
      "Led a 3‑engineer frontend team, designed a unified web + mobile UX, and shipped an admin panel for HR meetings analytics.",
    impact: "Unified UX across web and mobile",
    tech: ["React", "React Native", "TypeScript", "Redux", "Vue", "Node.js"],
    anonymous: true,
    links: [],
  },
  {
    title: "Enterprise banking onboarding (anonymous)",
    role: "JavaScript Developer",
    period: "Dec 2020 — Aug 2021",
    summary:
      "Built corporate banking onboarding flows and added Cypress E2E coverage for critical scenarios.",
    impact: "Initial load -40% via code splitting",
    tech: ["React", "Redux", "Redux-Saga", "Next.js", "Cypress"],
    anonymous: true,
    links: [],
  },
  {
    title: "LATOKEN",
    role: "Fullstack Developer",
    period: "Aug 2020 — Dec 2020",
    summary:
      "Delivered internal CRM dashboards, built BFF endpoints, and established cross-team code review practices.",
    impact: "Business metrics visibility",
    tech: ["React", "Redux", "Node.js", "Express", "TypeScript"],
    links: [],
  },
];
