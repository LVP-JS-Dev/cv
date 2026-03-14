import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required to generate robots.txt.");
  }
  const resolvedBaseUrl = baseUrl ?? "https://example.com";
  const noIndex =
    process.env.NEXT_PUBLIC_NOINDEX === "1" ||
    process.env.NEXT_PUBLIC_NOINDEX === "true";

  if (noIndex) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${resolvedBaseUrl}/sitemap.xml`,
  };
}
