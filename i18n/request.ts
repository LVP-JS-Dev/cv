import { type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "./routing";

export function detectLocale(request: NextRequest): Locale {
  const [, maybeLocale] = request.nextUrl.pathname.split("/");
  if (maybeLocale && locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}
