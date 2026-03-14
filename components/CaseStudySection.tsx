type CaseStudySectionProps = Readonly<{
  title: string;
  children: React.ReactNode;
}>;

type CaseStudyListProps = Readonly<{
  items: string[];
  listKey: string;
}>;

export function CaseStudySection({ title, children }: CaseStudySectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function CaseStudyList({ items, listKey }: CaseStudyListProps) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-slate-300">
      {items.map((item, index) => (
        <li key={`${listKey}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}
