import { Geist } from "next/font/google";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import "./globals.css";

const geist = Geist({ subsets: ["latin", "cyrillic"], variable: "--font-geist" });

type Params = {
  locale?: string;
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<Params>;
}>) {
  const { locale: localeParam } = await params;
  const locale = localeParam && locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  return (
    <html lang={locale} className={geist.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
