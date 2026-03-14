type PersonJsonLdInput = {
  name: string;
  jobTitle: string;
  email: string;
  url: string;
  sameAs?: string[];
};

type WebsiteJsonLdInput = {
  name: string;
  url: string;
  inLanguage: string;
  description: string;
};

export function buildPersonJsonLd(input: PersonJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: input.jobTitle,
    email: input.email,
    url: input.url,
    sameAs: input.sameAs?.length ? input.sameAs : undefined,
  };
}

export function buildWebsiteJsonLd(input: WebsiteJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    inLanguage: input.inLanguage,
    description: input.description,
  };
}
