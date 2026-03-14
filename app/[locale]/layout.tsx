import type { Metadata } from "next";
import { I18nProviderClient } from "@/locales/client";
import { getStaticParams } from "@/locales/server";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

type Params = {
  locale: string;
};

/**
 * Re-exports the server helper that supplies locale-aware static parameters.
 */
export const generateStaticParams = getStaticParams;

async function loadMessages(locale: Locale) {
  const modules = await Promise.all([
    import("@/locales/en"),
    import("@/locales/ru"),
  ]);
  const dictionary = {
    en: modules[0].default,
    ru: modules[1].default,
  } as const;
  return dictionary[locale];
}

/**
 * Builds per-locale metadata, falling back safely to the default locale.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const messages = await loadMessages(locale);
  const noIndex =
    process.env.NEXT_PUBLIC_NOINDEX === "1" ||
    process.env.NEXT_PUBLIC_NOINDEX === "true";
  const metadataBase = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  );
  const canonical = new URL(`/${locale}`, metadataBase).toString();
  const languages = Object.fromEntries(
    locales.map((entry) => [entry, new URL(`/${entry}`, metadataBase).toString()]),
  ) as Record<Locale, string>;

  return {
    title: messages?.hero?.headline || "Platform Engineering",
    description:
      messages?.hero?.description || "Engineering leadership focused on resilient products.",
    alternates: {
      canonical,
      languages,
    },
    metadataBase,
    robots: { index: !noIndex, follow: true },
    openGraph: {
      title: messages?.hero?.headline,
      description: messages?.hero?.description,
      url: canonical,
      type: "website",
      locale,
    },
  };
}

/**
 * Wraps each locale route in the client-side I18n provider.
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<Params>;
}>) {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  );
}
