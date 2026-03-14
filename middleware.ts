import { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { locales, defaultLocale } from "@/i18n/routing";

const i18nMiddleware = createI18nMiddleware(locales, defaultLocale);

export function middleware(request: NextRequest) {
  return i18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|trpc|.*\\..*).*)"],
};
