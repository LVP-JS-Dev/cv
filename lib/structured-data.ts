/**
 * Builds JSON-LD metadata for a person profile.
 */
export function buildPersonJsonLd(person: {
  name: string;
  jobTitle: string;
  email: string;
  url: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...person,
    sameAs: person.sameAs?.length ? person.sameAs : undefined,
  };
}

/**
 * Builds JSON-LD metadata for a website.
 */
export function buildWebsiteJsonLd(site: {
  name: string;
  url: string;
  inLanguage: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    ...site,
  };
}

/**
 * Builds JSON-LD metadata for a case study/article.
 */
export function buildArticleJsonLd(article: {
  headline: string;
  description: string;
  url: string;
  authorName: string;
  inLanguage: string;
  keywords?: string[];
  about?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: article.url,
    inLanguage: article.inLanguage,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    keywords: article.keywords?.length ? article.keywords : undefined,
    about: article.about,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}
