"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicPart } from "@/types/DynamicPart";
import { Apartment } from "@/types/Apartment";
import { AdminEndpoints } from "@/lib/adminApi";

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "muted";
}) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
  const styles: Record<string, string> = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    muted: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };
  return <span className={classNames(base, styles[variant])}>{children}</span>;
}

function Card({
  title,
  subtitle,
  actions,
  children,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl mt-3 border border-zinc-200 bg-white shadow-sm">
      {(title || subtitle || actions) && (
        <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 px-4 py-3">
          <div>
            {title && (
              <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-zinc-500 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function GhostButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-3.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/70"
    >
      {children}
    </Link>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-zinc-900 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400/70"
    >
      {children}
    </Link>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={classNames("animate-pulse rounded-md bg-zinc-200", className)}
    />
  );
}

// -------------------- Page --------------------

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [homeParts, setHomeParts] = useState<DynamicPart[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [dpRes, apRes] = await Promise.all([
          AdminEndpoints.homeParts("Home"),
          AdminEndpoints.apartments(),
        ]);

        const dpData = dpRes.data;
        const apData = apRes.data;
        
        setHomeParts(Array.isArray(dpData) ? dpData : []);
        setApartments(Array.isArray(apData) ? apData : []);
      } catch (e: any) {
        setErr(e?.message || "Errore di rete.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = useMemo(() => {
    const total = homeParts.length;
    const published = homeParts.filter((p) => p.published).length;
    const drafts = total - published;
    return { total, published, drafts, apartments: apartments.length };
  }, [homeParts, apartments]);

  const recent = useMemo(() => {
    return [...homeParts]
      .sort((a, b) => {
        const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return tB - tA;
      })
      .slice(0, 5);
  }, [homeParts]);

  const fmt = new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              Dashboard
            </h1>
            <div className="hidden items-center gap-2 sm:flex">
              <PrimaryButton href="/admin/homepage">
                Modifica sezioni Home
              </PrimaryButton>
              <GhostButton href="/admin/apartments">
                Elenco appartamenti
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-2">
        {/* Welcome / Quick actions */}
        <Card
          title={
            <span className="flex items-center gap-2">
              Benvenuto nel pannello
            </span>
          }
          subtitle="Gestisci velocemente la Home e gli appartamenti."
          actions={
            <div className="flex flex-wrap items-center gap-2 sm:hidden">
              <PrimaryButton href="/admin/home/dynamic-parts/new">
                + Nuova sezione Home
              </PrimaryButton>
              <GhostButton href="/admin/home/dynamic-parts">
                Elenco sezioni
              </GhostButton>
              <GhostButton href="/admin/apartments">
                Elenco appartamenti
              </GhostButton>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* KPI cards */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-zinc-500">Sezioni Home (totale)</div>
              <div className="mt-1 text-3xl font-extrabold text-zinc-900">
                {kpis.total}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Somma di tutte le sezioni per la pagina Home
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500">Pubblicate</div>
                <Badge variant="success">Live</Badge>
              </div>
              <div className="mt-1 text-3xl font-extrabold text-zinc-900">
                {kpis.published}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Visibili sul sito
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500">Bozze</div>
                <Badge variant="warning">Draft</Badge>
              </div>
              <div className="mt-1 text-3xl font-extrabold text-zinc-900">
                {kpis.drafts}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Non ancora pubblicate
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-zinc-500">Appartamenti</div>
              <div className="mt-1 text-3xl font-extrabold text-zinc-900">
                {kpis.apartments}
              </div>
              <div className="mt-1 text-xs text-zinc-500">Totale unità</div>
            </div>
          </div>
        </Card>

        {/* Error banner */}
        {err && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* Ultime modifiche */}
        <Card title="Ultime modifiche — Home">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-3">
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              title="Nessuna sezione trovata"
              description="Crea la prima dalla pagina \'Nuova sezione\'."
              cta={
                <PrimaryButton href="/admin/home/dynamic-parts/new">
                  Crea sezione
                </PrimaryButton>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    {[
                      "Chiave",
                      "Titolo",
                      "Stato",
                      "Ordine",
                      "Aggiornato",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className={classNames(
                          "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600",
                          h === "" && "text-right"
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {recent.map((r) => (
                    <tr key={r._id} className="hover:bg-zinc-50/70">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                        {r.key}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700">
                        {r.title || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {r.published ? (
                          <Badge variant="success">Pubblicata</Badge>
                        ) : (
                          <Badge variant="warning">Bozza</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums text-zinc-700">
                        {r.order ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700">
                        {r.updatedAt ? fmt.format(new Date(r.updatedAt)) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <GhostButton href={`/admin/dynamic-parts/${r._id}`}>
                          Modifica
                        </GhostButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Appartamenti */}
        <Card title="Appartamenti (ultimi 5)">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                </div>
              ))}
            </div>
          ) : apartments.length === 0 ? (
            <EmptyState
              title="Nessun appartamento trovato"
              description="Aggiungi il primo appartamento per iniziare."
              cta={
                <PrimaryButton href="/admin/apartments/new">
                  Aggiungi appartamento
                </PrimaryButton>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                      Titolo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                      Aggiornato
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {[...apartments]
                    .sort((a, b) => {
                      const tA = a.updatedAt
                        ? new Date(a.updatedAt).getTime()
                        : 0;
                      const tB = b.updatedAt
                        ? new Date(b.updatedAt).getTime()
                        : 0;
                      return tB - tA;
                    })
                    .slice(0, 5)
                    .map((a) => (
                      <tr key={a._id} className="hover:bg-zinc-50/70">
                        <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                          {a.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-700">
                          {a.updatedAt
                            ? fmt.format(new Date(a.updatedAt))
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <GhostButton
                            href={`/admin/apartments/${encodeURIComponent(
                              a.title
                            )}`}
                          >
                            Apri
                          </GhostButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-zinc-500">
          Suggerimento: usa le scorciatoie del browser (Alt+← / Alt+→) per
          navigare rapidamente.
        </p>
      </main>
    </div>
  );
}

// -------------------- Empty State --------------------

function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M4.5 6a3 3 0 013-3h9a3 3 0 013 3v12a3 3 0 01-3 3h-9a3 3 0 01-3-3V6zm3 2.25a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zm0 3.75a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zm0 3.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      {description && (
        <p className="max-w-md text-xs text-zinc-500">{description}</p>
      )}
      {cta && <div className="pt-1">{cta}</div>}
    </div>
  );
}
