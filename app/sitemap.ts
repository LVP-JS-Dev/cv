import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const now = new Date();

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: now,
  }));
}
