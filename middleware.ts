import { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { locales, defaultLocale } from "@/i18n/routing";

const i18nMiddleware = createI18nMiddleware(locales, defaultLocale);

/**
 * Entrypoint for Next middleware that delegates to the i18n helper.
 */
export function middleware(request: NextRequest) {
  return i18nMiddleware(request);
}

/**
 * Applies the middleware only to public-facing routes.
 */
export const config = {
  matcher: ["/((?!_next|_vercel|api|trpc|.*\\..*).*)"],
};
