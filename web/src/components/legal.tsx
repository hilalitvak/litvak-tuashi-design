export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8">
      <h1 className="font-display text-4xl font-light text-cream">{title}</h1>
      <p className="mt-3 text-sm text-cream-dim">עודכן לאחרונה: {updated}</p>
      <div className="mt-12 space-y-10">{children}</div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-light text-sand">{heading}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-cream-dim [&_a]:text-cream [&_a:hover]:text-sand [&_li]:mr-5 [&_strong]:text-cream [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
