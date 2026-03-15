import type { Metadata } from "next";
import { I18nProviderClient } from "@/locales/client";
import HtmlLang from "@/components/HtmlLang";
import LocaleSwitcher from "@/components/LocaleSwitcher";
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
  const localeModule = await import(`@/locales/${locale}`);
  return localeModule.default;
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
  const ogImage = new URL("/opengraph-image", metadataBase).toString();
  const twitterImage = new URL("/twitter-image", metadataBase).toString();

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: messages?.site?.name ?? "Portfolio",
        },
      ],
      siteName: messages?.site?.name,
    },
    twitter: {
      card: "summary_large_image",
      title: messages?.hero?.headline,
      description: messages?.hero?.description,
      images: [twitterImage],
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
      <div className="pointer-events-none fixed right-4 top-4 z-50 md:right-6 md:top-6">
        <LocaleSwitcher className="pointer-events-auto" />
      </div>
      <HtmlLang />
      {children}
    </I18nProviderClient>
  );
}
