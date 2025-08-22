import React from "react";

export function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {desc ? <p className="mt-1 text-sm text-slate-600">{desc}</p> : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}
