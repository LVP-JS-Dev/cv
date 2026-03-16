"use client";

import { createI18nClient } from "next-international/client";

/**
 * Client-side factory exposing hooks and provider for the localized UI.
 */
export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  en: () => import("./en"),
  ru: () => import("./ru"),
});
