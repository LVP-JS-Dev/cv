import { notFound } from "next/navigation";
import Link from "next/link";
import { contentProjects } from "@/content/projects";
import { getI18n } from "@/locales/server";
import { locales, type Locale } from "@/i18n/routing";

type Params = {
  locale: string;
  slug: string;
};

/**
 * Prebuilds static project routes based on known project slugs.
 */
export function generateStaticParams() {
  return contentProjects.map((project) => ({ slug: project.slug }));
}

/**
 * Generates per-project metadata (title/description/OG) for case studies.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : ("en" as Locale);
  const t = await getI18n();
  const project = contentProjects.find((item) => item.slug === slug);

  if (!project) {
    return { title: t("caseStudy.notFound") };
  }

  const title = project.anonymous
    ? `${t("caseStudy.confidential")} · ${project.industry ?? t("caseStudy.title")}`
    : project.title;

  return {
    title,
    description: project.summary,
    openGraph: {
      title,
      description: project.summary,
      type: "article",
      locale,
    },
  };
}

/**
 * Renders the localized project case study view for a given slug.
 */
export default async function ProjectDetailPage({
  params,
}: Readonly<{ params: Promise<Params> }>) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  const t = await getI18n();
  const project = contentProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const displayTitle = project.anonymous
    ? `${t("caseStudy.confidential")} · ${project.industry ?? t("caseStudy.title")}`
    : project.title;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-12 text-slate-100">
      <Link
        href={`/${locale}#projects`}
        className="text-sm uppercase tracking-[0.3em] text-slate-400"
      >
        {t("caseStudy.back")}
      </Link>
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {project.period} · {project.role}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-semibold text-white">{displayTitle}</h1>
          {project.anonymous ? (
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              {t("caseStudy.confidential")}
            </span>
          ) : null}
        </div>
        <p className="text-lg text-slate-300">{project.summary}</p>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{project.impact}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("caseStudy.overview")}</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          {project.overview.map((item, index) => (
            <li key={`${project.slug}-overview-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("caseStudy.outcomes")}</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          {project.outcomes.map((item, index) => (
            <li key={`${project.slug}-outcomes-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("caseStudy.challenges")}</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          {project.challenges.map((item, index) => (
            <li key={`${project.slug}-challenges-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("caseStudy.stack")}</h2>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          {project.tech.map((tech) => (
            <span key={tech} className="rounded-full border border-slate-800 px-3 py-1">
              {tech}
            </span>
          ))}
        </div>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          {project.stackNotes.map((item, index) => (
            <li key={`${project.slug}-stack-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      {project.links.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("caseStudy.links")}</h2>
          <div className="flex flex-wrap gap-3">
            {project.links.map((link, index) => (
              <Link
                key={`${project.slug}-link-${index}`}
                href={link.href}
                className="text-slate-300 underline underline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
