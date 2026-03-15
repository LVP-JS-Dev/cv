import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { defaultLocale } from "@/i18n/routing";
import "./globals.css";

const geist = Geist({ subsets: ["latin", "cyrillic"], variable: "--font-geist" });

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
  return (
    <html lang={defaultLocale} className={geist.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
