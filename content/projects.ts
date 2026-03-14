export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  summary: string;
  impact: string;
  tech: string[];
  period: string;
  role: string;
  anonymous?: boolean;
  links: ProjectLink[];
};

export const contentProjects: Project[] = [
  {
    title: "Biometric KYC / Liveness Verification",
    role: "Senior Fullstack Developer",
    period: "2024 — 2025",
    summary:
      "Built an iframe widget with cross‑browser getUserMedia support and optimized real‑time video streaming over WebSocket.",
    impact: "Latency 250ms → 150ms • 95%+ success rate",
    tech: ["React", "TypeScript", "WebSocket", "MediaStream"],
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
    role: "Senior Fullstack Developer",
    period: "2024",
    summary:
      "Delivered a Next.js landing page with interactive waveform comparison and automated CI/CD deployment.",
    impact: "PageSpeed 95+ mobile",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "CI/CD"],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
  {
    title: "Mobile Credit Application Flow",
    role: "Senior Frontend Developer",
    period: "2023",
    summary:
      "Implemented a WebView-ready React flow for a banking credit product and maintained a shared UI library.",
    impact: "12+ shared components across 5+ products",
    tech: ["React", "TypeScript", "Redux", "Webpack"],
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
    role: "Lead Development Engineer",
    period: "2022",
    summary:
      "Led a web + mobile experience for HR meeting analytics and shipped an admin panel for operations teams.",
    impact: "Unified web + mobile UX",
    tech: ["React", "React Native", "TypeScript", "Node.js"],
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
    role: "JavaScript Developer",
    period: "2021",
    summary:
      "Built onboarding flows for legal entities and added Cypress E2E coverage for critical scenarios.",
    impact: "Initial load time -40%",
    tech: ["React", "Redux", "Redux-Saga", "Cypress"],
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
    role: "Fullstack Developer",
    period: "2020",
    summary:
      "Built internal CRM analytics dashboards and a BFF layer to power sales operations.",
    impact: "Improved metrics visibility",
    tech: ["React", "Node.js", "Express", "TypeScript"],
    links: [
      {
        label: "Case study (placeholder)",
        href: "#",
      },
    ],
  },
];
