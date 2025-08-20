"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Row = {
  _id: string;
  key: string;
  page: string;
  title?: string;
  secondTitle?: string;
  order: number;
  published: boolean;
  updatedAt: string;
};

// -------------------- UI Primitives --------------------

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Badge({
  children,
  variant = "muted",
}: {
  children: React.ReactNode;
  variant?: "muted" | "success" | "warning" | "danger";
}) {
  const styles: Record<string, string> = {
    muted: "bg-zinc-100 text-zinc-700 border-zinc-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    danger: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
}

function GhostButton({ href, onClick, children, className }: { href?: string; onClick?: () => void; children: React.ReactNode; className?: string }) {
  const cls = cn(
    "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/70",
    className
  );
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-zinc-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400/70"
    >
      {children}
    </Link>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/60"
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 min-w-[10rem] rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/60"
    >
      {children}
    </select>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-zinc-200", className)} />;
}

// -------------------- Page --------------------

export default function DynamicPartsGestionePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [sort, setSort] = useState<"order" | "updatedAt">("order");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const fmt = new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" });

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("/api/dynamic-parts?page=Gestione", { cache: "no-store" });
      if (!res.ok) throw new Error("Errore nel caricamento delle sezioni.");
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Errore di rete");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = rows.filter((x) => {
      const okQ = !q || [x.key, x.title, x.secondTitle].some((f) => (f || "").toLowerCase().includes(q));
      const okS =
        status === "all" ? true : status === "published" ? x.published === true : x.published === false;
      return okQ && okS;
    });

    r.sort((a, b) => {
      const dirMul = dir === "asc" ? 1 : -1;
      if (sort === "order") {
        return ((a.order ?? 0) - (b.order ?? 0)) * dirMul;
      }
      const ta = new Date(a.updatedAt).getTime();
      const tb = new Date(b.updatedAt).getTime();
      return (ta - tb) * dirMul;
    });

    return r;
  }, [rows, query, status, sort, dir]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Sezioni Dinamiche — Gestione</h1>
            <div className="flex items-center gap-2">
              <GhostButton onClick={load}>Ricarica</GhostButton>
              <PrimaryButton href="/admin/dynamic-parts/new">+ Nuovo</PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:max-w-md">
            <label className="text-xs font-medium text-zinc-600">Cerca</label>
            <Input value={query} onChange={setQuery} placeholder="Cerca per chiave o titolo…" />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-600">Stato</label>
              <Select value={status} onChange={(v) => setStatus(v as any)}>
                <option value="all">Tutti</option>
                <option value="published">Pubblicato</option>
                <option value="draft">Bozza</option>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-600">Ordina per</label>
              <Select value={sort} onChange={(v) => setSort(v as any)}>
                <option value="order">Ordine</option>
                <option value="updatedAt">Aggiornato</option>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-600">Direzione</label>
              <Select value={dir} onChange={(v) => setDir(v as any)}>
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Table / States */}
        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="max-h-[70vh] overflow-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="sticky top-0 z-10 bg-zinc-50">
                <tr>
                  {[
                    "Ordine",
                    "Chiave",
                    "Titolo",
                    "Secondo titolo",
                    "Stato",
                    "Aggiornato",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={cn(
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
                {loading
                  ? [...Array(6)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                        <td className="px-4 py-3 text-right"><Skeleton className="h-9 w-20" /></td>
                      </tr>
                    ))
                  : filtered.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16">
                          <EmptyState
                            title="Nessuna sezione trovata"
                            description="Cambia filtri/ricerca oppure crea una nuova sezione."
                            cta={<PrimaryButton href="/admin/dynamic-parts/new">+ Crea sezione</PrimaryButton>}
                          />
                        </td>
                      </tr>
                    )
                  : filtered.map((r) => (
                      <tr key={r._id} className="hover:bg-zinc-50/70">
                        <td className="px-4 py-3 text-sm tabular-nums text-zinc-700">{r.order ?? 0}</td>
                        <td className="px-4 py-3 text-sm font-mono text-zinc-800"><code>{r.key}</code></td>
                        <td className="px-4 py-3 text-sm text-zinc-800">{r.title || "—"}</td>
                        <td className="px-4 py-3 text-sm text-zinc-800">{r.secondTitle || "—"}</td>
                        <td className="px-4 py-3 text-sm">
                          {r.published ? (
                            <Badge variant="success">Pubblicato</Badge>
                          ) : (
                            <Badge variant="warning">Bozza</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-700">{fmt.format(new Date(r.updatedAt))}</td>
                        <td className="px-4 py-3 text-right text-sm">
                          <GhostButton href={`/admin/dynamic-parts/${r._id}`} className="h-8">Modifica</GhostButton>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">Suggerimento: premi <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1">R</kbd> per ricaricare.</p>
      </main>
    </div>
  );
}

// -------------------- Empty State --------------------

function EmptyState({ title, description, cta }: { title: string; description?: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M4.5 6a3 3 0 013-3h9a3 3 0 013 3v12a3 3 0 01-3 3h-9a3 3 0 01-3-3V6zm3 2.25a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zm0 3.75a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zm0 3.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" clipRule="evenodd" />
        </svg>
      </div>
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      {description && <p className="max-w-md text-xs text-zinc-500">{description}</p>}
      {cta && <div className="pt-1">{cta}</div>}
    </div>
  );
}

// -------------------- Keyboard shortcut (optional) --------------------

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const btn = document.querySelector<HTMLButtonElement>("button:contains('Ricarica')");
      // Fallback: emit a custom event to trigger reload without querying DOM by label
      window.dispatchEvent(new CustomEvent("dynamic-parts-reload"));
    }
  });
}
