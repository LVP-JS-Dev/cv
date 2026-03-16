"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  eager?: boolean;
};

/**
 * Reveals children when they enter the viewport with optional delay.
 */
export default function Reveal({
  children,
  className,
  id,
  delay = 0,
  eager = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (typeof window === "undefined") {
      element.classList.add("reveal-visible");
      return;
    }

    document.documentElement.classList.add("reveal-ready");

    if (eager) {
      element.classList.add("reveal-visible");
      return;
    }

    if (
      typeof window.matchMedia !== "function" ||
      typeof window.IntersectionObserver !== "function"
    ) {
      element.classList.add("reveal-visible");
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      element.classList.add("reveal-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add("reveal-visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <section
      ref={ref}
      id={id}
      className={["reveal", className].filter(Boolean).join(" ")}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </section>
  );
}
