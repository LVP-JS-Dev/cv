"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";

type LocaleSwitcherProps = {
  className?: string;
  currentLocale: Locale;
  label: string;
};

/**
 * Locale switcher that keeps the current path, query, and hash.
 */
export default function LocaleSwitcher({
  className,
  currentLocale,
  label,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash ?? "");
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const localeLinks = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const query = searchParams.toString();

    return locales.map((locale) => {
      const nextSegments = [...segments];
      if (nextSegments.length > 0 && locales.includes(nextSegments[0] as Locale)) {
        nextSegments[0] = locale;
      } else {
        nextSegments.unshift(locale);
      }

      const basePath = `/${nextSegments.join("/")}`;
      const suffix = query ? `?${query}` : "";
      return {
        locale,
        href: `${basePath}${suffix}${hash}`,
      };
    });
  }, [hash, pathname, searchParams]);

  return (
    <nav
      aria-label={label}
      className={[
        "flex items-center gap-1 rounded-full border border-slate-800/70 bg-slate-950/70 p-1 text-xs uppercase tracking-[0.2em] text-slate-300 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {localeLinks.map(({ locale, href }) => (
        <Link
          key={locale}
          href={href}
          aria-current={locale === currentLocale ? "page" : undefined}
          className={
            locale === currentLocale
              ? "rounded-full bg-white/90 px-3 py-1 font-semibold text-slate-900"
              : "rounded-full px-3 py-1 text-slate-300 transition hover:text-white"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
