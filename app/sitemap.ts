import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required to generate sitemap.");
  }
  const resolvedBaseUrl = (baseUrl ?? "https://example.com").replace(/\/+$/, "");
  const lastModified = new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-03-14");

  return locales.map((locale) => ({
    url: `${resolvedBaseUrl}/${locale}`,
    lastModified,
  }));
}
