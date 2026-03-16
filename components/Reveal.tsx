import type { CSSProperties } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  eager?: boolean;
};

/**
 * Reveals children with a simple load animation.
 */
export default function Reveal({
  children,
  className,
  id,
  delay = 0,
  eager = false,
}: RevealProps) {
  return (
    <section
      id={id}
      className={["reveal", eager ? "reveal-eager" : null, className]
        .filter(Boolean)
        .join(" ")}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </section>
  );
}
