import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import { Geist } from "next/font/google";
import "../globals.css";

const geist = Geist({ subsets: ["latin", "cyrillic"], variable: "--font-geist" });

type Params = {
  locale: string;
};

async function loadMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

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
    title: messages?.root?.hero?.headline || "Platform Engineering",
    description:
      messages?.root?.hero?.description || "Engineering leadership focused on resilient products.",
    alternates: {
      canonical,
      languages,
    },
    metadataBase,
    robots: { index: !noIndex, follow: true },
    openGraph: {
      title: messages?.root?.hero?.headline,
      description: messages?.root?.hero?.description,
      url: canonical,
      type: "website",
      locale,
    },
  };
}

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
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} className={geist.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
