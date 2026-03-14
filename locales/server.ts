import { createI18nServer } from "next-international/server";

/**
 * Server-side factory that resolves translations and helpers per locale.
 */
export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
  createI18nServer({
    en: () => import("./en"),
    ru: () => import("./ru"),
  });
