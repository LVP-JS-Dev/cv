"use client";

import { useEffect } from "react";
import { useCurrentLocale } from "@/locales/client";

/**
 * Syncs the document language attribute with the active locale.
 */
export default function HtmlLang() {
  const locale = useCurrentLocale();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
