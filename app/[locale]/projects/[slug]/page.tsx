import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getI18n } from "@/locales/server";
import { contentProjects } from "@/content/projects";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

type Params = {
  locale: string;
  slug: string;
};

const getProjectBySlug = (slug: string) =>
  contentProjects.find((project) => project.slug === slug);

/**
 * Builds all available locale/slug pairs for static rendering.
 */
export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    contentProjects.map((project) => ({
      locale,
      slug: project.slug,
    })),
  );
}

/**
 * Derives metadata for a project detail page based on locale and slug.
 */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = locales.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : defaultLocale;
  const project = getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: "Project",
      description: "Project details",
    };
  }
  const t = await getI18n();
  const industryTag = project.industry ? ` — ${project.industry}` : "";
  const title = project.anonymous
    ? `${t("projectDetail.confidentialTitle")}${industryTag}`
    : project.title;
  const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com");
  const canonical = new URL(`/${locale}/projects/${project.slug}`, baseUrl).toString();

  return {
    title,
    description: project.summary,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: project.summary,
      url: canonical,
      type: "article",
      locale,
    },
    twitter: {
      title,
      description: project.summary,
    },
  };
}

/**
 * Renders a localized project detail screen using the requested slug.
 */
export default async function ProjectDetail({ params }: { params: Params }) {
  const locale = locales.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : defaultLocale;
  const project = getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const t = await getI18n();
  const projectLink = `/${locale}/projects/${project.slug}`;
  const industryLabel = project.industry ? project.industry : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 text-slate-100">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          {project.anonymous && (
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
              {t("projectDetail.confidentialBadge")}
            </span>
          )}
          {industryLabel && (
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {industryLabel}
            </span>
          )}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {project.period} · {project.role}
        </p>
        <h1 className="text-4xl font-semibold text-white">
          {project.title}
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl">{project.summary}</p>
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          {project.impact}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{t("projectDetail.overview")}</h2>
        <div className="space-y-2 text-slate-300">
          {project.overview.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{t("projectDetail.outcomes")}</h2>
        <div className="space-y-2 text-slate-300">
          {project.outcomes.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{t("projectDetail.challenges")}</h2>
        <div className="space-y-2 text-slate-300">
          {project.challenges.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{t("projectDetail.stack")}</h2>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          {project.tech.map((tech) => (
            <span key={tech} className="rounded-full border border-slate-800 px-3 py-1">
              {tech}
            </span>
          ))}
        </div>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          {project.stackNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">{t("projectDetail.links")}</h2>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          {project.links.map((link) => (
            <Link
              key={link.label}
              href={link.href === "#" ? projectLink : link.href}
              className="rounded-full border border-slate-800 px-4 py-2 text-slate-300 underline-offset-2 hover:border-slate-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <div>
        <Link
          href={`/${locale}/#projects`}
          className="text-sm uppercase tracking-[0.4em] text-slate-400"
        >
          {t("projectDetail.back")}
        </Link>
      </div>
    </main>
  );
}
