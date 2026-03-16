"use client";

import { useRef } from "react";
import type { HTMLAttributes } from "react";
import { motion, useInView, useReducedMotion, type MotionProps } from "framer-motion";

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
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    amount: 0.2,
    once: true,
  });
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 1, y: 24, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const initial = prefersReducedMotion || eager ? "visible" : "hidden";
  const animate = prefersReducedMotion
    ? "visible"
    : eager
      ? "visible"
      : isInView
        ? "visible"
        : "hidden";

  return (
    <MotionSection
      ref={ref}
      id={id}
      className={className}
      initial={initial}
      animate={animate}
      variants={variants}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </MotionSection>
  );
}
const MotionSection = motion.section as React.ComponentType<
  HTMLAttributes<HTMLElement> & MotionProps & React.RefAttributes<HTMLElement>
>;
