import { NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { locales, defaultLocale } from "@/i18n/routing";

const i18nMiddleware = createI18nMiddleware({ locales, defaultLocale });

/**
 * Entrypoint for Next proxy that delegates to the i18n helper.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (matchedLocale) {
    const headers = new Headers(request.headers);
    headers.set("X-Next-Locale", matchedLocale);
    const response = NextResponse.next({ request: { headers } });
    response.cookies.set("Next-Locale", matchedLocale);
    return response;
  }

  return i18nMiddleware(request);
}

/**
 * Applies the middleware only to public-facing routes.
 */
export const config = {
  matcher: ["/((?!_next|_vercel|api|trpc|.*\\..*).*)"],
};
