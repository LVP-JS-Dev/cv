import Link from "next/link";
import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content.trim()) {
    return null;
  }

  const components: Components = {
    h1: ({ node, className, ...props }) => (
      <h1
        {...props}
        className={mergeClassNames("text-3xl font-semibold text-white", className)}
      />
    ),
    h2: ({ node, className, ...props }) => (
      <h2
        {...props}
        className={mergeClassNames("text-2xl font-semibold text-white", className)}
      />
    ),
    h3: ({ node, className, ...props }) => (
      <h3
        {...props}
        className={mergeClassNames("text-xl font-semibold text-white", className)}
      />
    ),
    p: ({ node, className, ...props }) => (
      <p {...props} className={mergeClassNames("leading-relaxed text-slate-300", className)} />
    ),
    ul: ({ node, className, ...props }) => (
      <ul {...props} className={mergeClassNames("list-disc space-y-2 pl-5 text-slate-300", className)} />
    ),
    ol: ({ node, className, ...props }) => (
      <ol
        {...props}
        className={mergeClassNames("list-decimal space-y-2 pl-5 text-slate-300", className)}
      />
    ),
    li: ({ node, className, ...props }) => (
      <li {...props} className={mergeClassNames("text-slate-300", className)} />
    ),
    a: ({ node, className, href, children, ...props }) => {
      if (!href) {
        return <span>{children}</span>;
      }
      const linkClassName = mergeClassNames("text-slate-200 underline underline-offset-2", className);
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return (
          <Link href={href} className={linkClassName}>
            {children}
          </Link>
        );
      }
      return (
        <a
          {...props}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ node, className, ...props }) => (
      <blockquote
        {...props}
        className={mergeClassNames("border-l-2 border-slate-700 pl-4 text-slate-300", className)}
      />
    ),
    code: ({ node, className, children, ...props }) => (
      <code
        {...props}
        className={mergeClassNames(
          "rounded bg-slate-900/70 px-1 py-0.5 text-sm text-slate-200",
          className,
        )}
      >
        {children}
      </code>
    ),
    pre: ({ node, className, ...props }) => (
      <pre
        {...props}
        className={mergeClassNames(
          "overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200",
          className,
        )}
      />
    ),
  };

  return (
    <div className="space-y-4 text-slate-300">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}

const mergeClassNames = (...values: Array<string | undefined>) => {
  return values.filter(Boolean).join(" ");
};
