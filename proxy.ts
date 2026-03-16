import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type Locale } from "./i18n/routing";

const cookieName = "Next-Locale";

const normalizeLocale = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }
  return locales.includes(value as Locale) ? (value as Locale) : null;
};

const getLocaleFromHeader = (value: string | null) => {
  if (!value) {
    return null;
  }
  const codes = value
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .map((lang) => lang.split("-")[0]);
  for (const code of codes) {
    const normalized = normalizeLocale(code);
    if (normalized) {
      return normalized;
    }
  }
  return null;
};

const detectLocale = (request: NextRequest) => {
  const cookieLocale = normalizeLocale(request.cookies.get(cookieName)?.value);
  if (cookieLocale) {
    return cookieLocale;
  }
  return getLocaleFromHeader(request.headers.get("accept-language")) ?? defaultLocale;
};

/**
 * Detects locale via cookie/accept-language and redirects to locale-prefixed routes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  const locale = (matchedLocale ?? detectLocale(request)) as Locale;

  if (!matchedLocale) {
    const url = request.nextUrl.clone();
    const suffix = pathname === "/" ? "" : pathname;
    url.pathname = `/${locale}${suffix}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(cookieName, locale, { path: "/" });
    response.headers.set("x-locale", locale);
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(cookieName, locale, { path: "/" });
  return response;
}

/**
 * Applies locale middleware only to public-facing routes.
 */
export const config = {
  matcher: ["/((?!_next|_vercel|api|trpc|.*\\..*).*)"],
};
