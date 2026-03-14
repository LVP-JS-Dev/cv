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
