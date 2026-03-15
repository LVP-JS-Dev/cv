"use client";

import { useEffect } from "react";

const opacityWhenActive = "0.4";

/**
 * Tracks the cursor position for the spotlight background.
 */
export default function CursorSpotlight() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      root.style.setProperty("--spotlight-opacity", "0");
      return;
    }

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const updateSpotlight = (x: number, y: number) => {
      root.style.setProperty("--spotlight-x", `${x}px`);
      root.style.setProperty("--spotlight-y", `${y}px`);
      root.style.setProperty("--spotlight-opacity", opacityWhenActive);
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
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return null;
}
