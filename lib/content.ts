import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/i18n/routing";

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  impact: string;
  tech: string[];
  period: string;
  role: string;
  body: string;
  overview: string[];
  outcomes: string[];
  challenges: string[];
  stackNotes: string[];
  industry?: string;
  anonymous?: boolean;
  links: ProjectLink[];
  order?: number;
};

export type ExperienceLink = {
  label: string;
  href: string;
};

export type Experience = {
  title: string;
  summary: string;
  impact: string;
  tech: string[];
  period: string;
  role: string;
  anonymous?: boolean;
  links: ExperienceLink[];
  order?: number;
};

const contentRoot = path.join(process.cwd(), "content");

const readMarkdownFile = cache(async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return matter(file);
});

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const listSlugs = cache(async (section: "projects" | "experience") => {
  const directory = path.join(contentRoot, section);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
});

const getLocaleFilePath = async (
  section: "projects" | "experience",
  slug: string,
  locale: Locale,
  allowFallback = true,
) => {
  const localePath = path.join(contentRoot, section, slug, `${locale}.md`);
  if (await fileExists(localePath)) {
    return localePath;
  }
  if (!allowFallback) {
    return null;
  }
  const fallbackPath = path.join(contentRoot, section, slug, `${defaultLocale}.md`);
  if (await fileExists(fallbackPath)) {
    return fallbackPath;
  }
  return null;
};

const asString = (value: unknown, field: string, filePath: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected "${field}" in ${filePath}`);
  }
  return value;
};

const asStringArray = (value: unknown, field: string, filePath: string) => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Expected "${field}" array in ${filePath}`);
  }
  return value;
};

const asBooleanOptional = (value: unknown, field: string, filePath: string) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "boolean") {
    throw new Error(`Expected "${field}" boolean in ${filePath}`);
  }
  return value;
};

const asNumberOptional = (value: unknown, field: string, filePath: string) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Expected "${field}" number in ${filePath}`);
  }
  return value;
};

const asLinks = (value: unknown, field: string, filePath: string) => {
  if (value === undefined) {
    return [] as ProjectLink[];
  }
  if (!Array.isArray(value)) {
    throw new Error(`Expected "${field}" array in ${filePath}`);
  }
  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Expected "${field}" item at ${index} in ${filePath}`);
    }
    const record = item as { label?: unknown; href?: unknown };
    return {
      label: asString(record.label, `${field}[${index}].label`, filePath),
      href: asString(record.href, `${field}[${index}].href`, filePath),
    };
  });
};

const sortByOrder = <T extends { order?: number }>(items: T[]) => {
  return [...items].sort((a, b) => (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY));
};

const parseProject = (
  data: Record<string, unknown>,
  content: string,
  filePath: string,
): Project => {
  const anonymous = asBooleanOptional(data.anonymous, "anonymous", filePath);
  const industry =
    data.industry === undefined ? undefined : asString(data.industry, "industry", filePath);
  if (anonymous && !industry) {
    throw new Error(`Expected "industry" for anonymous project in ${filePath}`);
  }
  return {
    title: asString(data.title, "title", filePath),
    slug: asString(data.slug, "slug", filePath),
    summary: asString(data.summary, "summary", filePath),
    impact: asString(data.impact, "impact", filePath),
    tech: asStringArray(data.tech, "tech", filePath),
    period: asString(data.period, "period", filePath),
    role: asString(data.role, "role", filePath),
    body: content.trim(),
    overview: asStringArray(data.overview, "overview", filePath),
    outcomes: asStringArray(data.outcomes, "outcomes", filePath),
    challenges: asStringArray(data.challenges, "challenges", filePath),
    stackNotes: asStringArray(data.stackNotes, "stackNotes", filePath),
    industry,
    anonymous,
    links: asLinks(data.links, "links", filePath),
    order: asNumberOptional(data.order, "order", filePath),
  };
};

const parseExperience = (data: Record<string, unknown>, filePath: string): Experience => {
  return {
    title: asString(data.title, "title", filePath),
    summary: asString(data.summary, "summary", filePath),
    impact: asString(data.impact, "impact", filePath),
    tech: asStringArray(data.tech, "tech", filePath),
    period: asString(data.period, "period", filePath),
    role: asString(data.role, "role", filePath),
    anonymous: asBooleanOptional(data.anonymous, "anonymous", filePath),
    links: asLinks(data.links, "links", filePath),
    order: asNumberOptional(data.order, "order", filePath),
  };
};

export const getProjectSlugs = cache(async () => {
  return listSlugs("projects");
});

/**
 * Returns project slugs that have a markdown file for the given locale.
 */
export const getProjectSlugsForLocale = cache(async (locale: Locale) => {
  const slugs = await listSlugs("projects");
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = await getLocaleFilePath("projects", slug, locale, false);
      return filePath ? slug : null;
    }),
  );
  return items.filter(Boolean) as string[];
});

export const getProjects = cache(async (locale: Locale) => {
  const slugs = await listSlugs("projects");
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = await getLocaleFilePath("projects", slug, locale);
      if (!filePath) {
        return null;
      }
      const { data, content } = await readMarkdownFile(filePath);
      return parseProject(data as Record<string, unknown>, content, filePath);
    }),
  );
  return sortByOrder(items.filter(Boolean) as Project[]);
});

export const getProjectBySlug = cache(async (locale: Locale, slug: string) => {
  const filePath = await getLocaleFilePath("projects", slug, locale);
  if (!filePath) {
    return null;
  }
  const { data, content } = await readMarkdownFile(filePath);
  return parseProject(data as Record<string, unknown>, content, filePath);
});

export const getExperience = cache(async (locale: Locale) => {
  const slugs = await listSlugs("experience");
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = await getLocaleFilePath("experience", slug, locale);
      if (!filePath) {
        return null;
      }
      const { data } = await readMarkdownFile(filePath);
      return parseExperience(data as Record<string, unknown>, filePath);
    }),
  );
  return sortByOrder(items.filter(Boolean) as Experience[]);
});
