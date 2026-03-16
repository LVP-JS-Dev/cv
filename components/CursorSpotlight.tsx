"use client";

import { useEffect } from "react";

const opacityWhenActive = "0.45";

/**
 * Tracks the cursor position for the spotlight background.
 */
export default function CursorSpotlight() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    const hasFinePointer =
      window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(any-pointer: fine)").matches;
    const hasCoarsePointer =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(any-pointer: coarse)").matches;

    const isAutomated = navigator.webdriver && process.env.NODE_ENV === "production";

    if (!supportsHover || (!hasFinePointer && hasCoarsePointer) || isAutomated) {
      root.classList.remove("spotlight-ready");
      root.style.setProperty("--spotlight-opacity", "0");
      return;
    }

    root.classList.add("spotlight-ready");

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const activeOpacity = prefersReducedMotion ? "0.35" : opacityWhenActive;

    const updateSpotlight = (x: number, y: number) => {
      root.style.setProperty("--spotlight-x", `${x}px`);
      root.style.setProperty("--spotlight-y", `${y}px`);
      root.style.setProperty("--spotlight-opacity", activeOpacity);
    };

    const handleMove = (event: MouseEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        updateSpotlight(lastX, lastY);
      });
    };

    const handleLeave = () => {
      root.style.setProperty("--spotlight-opacity", "0");
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave, { passive: true });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      root.classList.remove("spotlight-ready");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return null;
}
