import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getProjectSlugsForLocale } from "@/lib/content";

/**
 * Generates a locale-aware sitemap using the configured site URL.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required to generate sitemap.");
  }
  const resolvedBaseUrl = (baseUrl ?? "https://example.com").replace(/\/+$/, "");
  const lastModified = new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-03-14");
  const localeSlugs = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      slugs: await getProjectSlugsForLocale(locale),
    })),
  );

  return [
    ...locales.map((locale) => ({
      url: `${resolvedBaseUrl}/${locale}`,
      lastModified,
    })),
    ...localeSlugs.flatMap(({ locale, slugs }) =>
      slugs.map((slug) => ({
        url: `${resolvedBaseUrl}/${locale}/projects/${slug}`,
        lastModified,
      })),
    ),
  ];
}
