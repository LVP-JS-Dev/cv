import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import CursorSpotlight from "@/components/CursorSpotlight";
import "./globals.css";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  ),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const headerLocale = headerList.get("x-locale");
  const locale = locales.includes(headerLocale as Locale)
    ? (headerLocale as Locale)
    : defaultLocale;

  return (
    <html lang={locale} className={geist.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <CursorSpotlight />
        <div className="sky-container" aria-hidden="true">
          <span className="star star-1" />
          <span className="star star-2" />
          <span className="star star-3" />
          <span className="star star-4" />
          <span className="star star-5" />
          <span className="star star-6" />
        </div>
        {children}
      </body>
    </html>
  );
}
