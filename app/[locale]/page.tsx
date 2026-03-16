import { notFound } from "next/navigation";
import { getI18n } from "@/locales/server";
import Link from "next/link";
import { getExperience, getProjects } from "@/lib/content";
import { locales, type Locale } from "@/i18n/routing";
import { setStaticParamsLocale } from "next-international/server";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { buildPersonJsonLd, buildWebsiteJsonLd } from "@/lib/structured-data";

type Params = {
  locale: string;
};

const contactLinks = {
  telegram: "https://t.me/lvpjsdev",
  github: "https://github.com/placeholder",
  linkedin: "https://linkedin.com/in/placeholder",
  cv: "/cv.pdf",
};

/**
 * Renders the localized home page content.
 */
export default async function LocaleHome({
  params,
}: Readonly<{ params: Promise<Params> }>) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }
  setStaticParamsLocale(locale);
  const t = await getI18n();
  const qualityPoints = [
    t("sections.engineeringQualityPoints.one"),
    t("sections.engineeringQualityPoints.two"),
    t("sections.engineeringQualityPoints.three"),
  ];
  const contactFormStrings = {
    nameLabel: t("contactForm.nameLabel"),
    emailLabel: t("contactForm.emailLabel"),
    messageLabel: t("contactForm.messageLabel"),
    submit: t("contactForm.submit"),
    sending: t("contactForm.sending"),
    or: t("contactForm.or"),
    mailto: t("contactForm.mailto"),
    emailAddress: t("cta.email"),
    success: t("contactForm.success"),
    errorSpam: t("contactForm.errorSpam"),
    errorRate: t("contactForm.errorRate"),
    errorInvalid: t("contactForm.errorInvalid"),
    errorSend: t("contactForm.errorSend"),
    errorFallback: t("contactForm.errorFallback"),
    errorMissing: t("contactForm.errorMissing"),
  };
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const canonicalUrl = new URL(`/${locale}`, baseUrl).toString();
  const sameAs = [contactLinks.telegram, contactLinks.github, contactLinks.linkedin].filter(
    (url) => Boolean(url) && !/placeholder/i.test(url),
  );
  const jsonLd = [
    buildPersonJsonLd({
      name: "Leonid Petrov",
      jobTitle: t("hero.headline"),
      email: t("cta.email"),
      url: canonicalUrl,
      ...(sameAs.length ? { sameAs } : {}),
    }),
    buildWebsiteJsonLd({
      name: t("site.name"),
      description: t("site.description"),
      inLanguage: locale,
      url: canonicalUrl,
    }),
  ];
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  const [experience, projects] = await Promise.all([
    getExperience(locale),
    getProjects(locale),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-14 px-6 py-12 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <Reveal className="space-y-6" id="hero" eager>
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{t("nav")}</p>
        <h1 className="text-5xl font-semibold leading-tight text-white">
          {t("hero.headline")}
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl">{t("hero.description")}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={`mailto:${t("cta.email")}`}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-slate-900 transition hover:bg-white"
          >
            {t("cta.primary")}
          </Link>
          <Link
            href={contactLinks.telegram}
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-200"
          >
            {t("cta.telegram")}
          </Link>
          <Link
            href={contactLinks.github}
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-200"
          >
            {t("cta.github")}
          </Link>
        </div>
      </Reveal>

      <Reveal className="space-y-4" id="about" delay={0.12}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("sections.about")}</h2>
          <Link href="#contact" className="text-sm uppercase tracking-[0.2em] text-slate-400">
            {t("sections.contact")}
          </Link>
        </div>
        <p className="text-slate-300 max-w-3xl">{t("sections.aboutSummary")}</p>
      </Reveal>

      <Reveal className="space-y-6" id="experience" delay={0.24}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("sections.experience")}</h2>
          <Link href="#experience" className="text-sm uppercase tracking-[0.2em] text-slate-400">
            {t("cta.experience")}
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {experience.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-6"
            >
              <header className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {item.period} · {item.role}
                </p>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                  {item.impact}
                </p>
              </header>
              <p className="mt-3 text-slate-300">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                {item.tech.map((tech) => (
                  <span key={tech} className="rounded-full border border-slate-800 px-3 py-1">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-300">
                {item.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-300 underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="space-y-6" id="projects" delay={0.36}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("sections.projects")}</h2>
          <Link href="#projects" className="text-sm uppercase tracking-[0.2em] text-slate-400">
            {t("cta.projects")}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {project.period} · {project.role}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                {project.tech.map((tech) => (
                  <span key={tech} className="rounded-full border border-slate-800 px-3 py-1">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-300">
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="text-slate-300 underline underline-offset-2"
                >
                  {t("caseStudy.view")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal
        className="space-y-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6"
        id="quality"
        delay={0.48}
      >
        <h2 className="text-2xl font-semibold text-white">{t("sections.engineeringQuality")}</h2>
        <p className="text-slate-300">{t("sections.engineeringQualityDescription")}</p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          {qualityPoints.map((point, index) => (
            <li key={`quality-${index}`}>{point}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal
        className="space-y-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6"
        id="content"
        delay={0.6}
      >
        <h2 className="text-2xl font-semibold text-white">{t("sections.content")}</h2>
        <p className="text-slate-300 max-w-3xl">{t("sections.contentDescription")}</p>
        <p className="text-sm text-slate-500">{t("sections.contentPrompt")}</p>
      </Reveal>

      <Reveal
        className="space-y-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-8"
        id="contact"
        delay={0.72}
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            {t("sections.contact")}
          </p>
          <h2 className="text-3xl font-semibold text-white">{t("cta.email")}</h2>
        </div>
        <p className="text-sm text-slate-300">{t("contactForm.subtitle")}</p>
        <ContactForm strings={contactFormStrings} />
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <Link
            href={contactLinks.telegram}
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-300"
          >
            {t("cta.telegram")}
          </Link>
          <Link
            href={contactLinks.github}
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-300"
          >
            {t("cta.github")}
          </Link>
          <Link
            href={contactLinks.linkedin}
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-300"
          >
            {t("cta.linkedin")}
          </Link>
          <Link
            href={contactLinks.cv}
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-300"
          >
            {t("cta.cv")}
          </Link>
        </div>
        <p className="text-xs text-slate-500">{t("cta.placeholderNote")}</p>
      </Reveal>
    </main>
  );
}
