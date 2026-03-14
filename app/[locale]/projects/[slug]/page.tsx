import { notFound } from "next/navigation";
import Link from "next/link";
import { setStaticParamsLocale } from "next-international/server";
import { contentProjects } from "@/content/projects";
import { getI18n } from "@/locales/server";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

type Params = {
  locale: string;
  slug: string;
};

type CaseStudySectionProps = Readonly<{
  title: string;
  children: React.ReactNode;
}>;

type CaseStudyListProps = Readonly<{
  items: string[];
  listKey: string;
}>;

function CaseStudySection({ title, children }: CaseStudySectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function CaseStudyList({ items, listKey }: CaseStudyListProps) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-slate-300">
      {items.map((item, index) => (
        <li key={`${listKey}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Prebuilds static project routes based on known project slugs.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    contentProjects.map((project) => ({ locale, slug: project.slug })),
  );
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
    : defaultLocale;
  setStaticParamsLocale(locale);
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
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const project = contentProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const displayTitle = project.anonymous
    ? `${t("caseStudy.confidential")} · ${project.industry ?? t("caseStudy.title")}`
    : project.title;
  const listSections = [
    { key: "overview", title: t("caseStudy.overview"), items: project.overview },
    { key: "outcomes", title: t("caseStudy.outcomes"), items: project.outcomes },
    { key: "challenges", title: t("caseStudy.challenges"), items: project.challenges },
  ];

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

      {listSections.map((section) => (
        <CaseStudySection key={section.key} title={section.title}>
          <CaseStudyList
            items={section.items}
            listKey={`${project.slug}-${section.key}`}
          />
        </CaseStudySection>
      ))}

      <CaseStudySection title={t("caseStudy.stack")}>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          {project.tech.map((tech) => (
            <span key={tech} className="rounded-full border border-slate-800 px-3 py-1">
              {tech}
            </span>
          ))}
        </div>
        <CaseStudyList items={project.stackNotes} listKey={`${project.slug}-stack`} />
      </CaseStudySection>

      {project.links.length > 0 ? (
        <CaseStudySection title={t("caseStudy.links")}>
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
        </CaseStudySection>
      ) : null}
    </main>
  );
}
