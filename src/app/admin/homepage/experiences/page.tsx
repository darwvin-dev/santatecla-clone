"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DynamicPart } from "@/types/DynamicPart";

// -------------------- UI primitives --------------------
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Card({ title, subtitle, children, actions, className="" }: { title?: React.ReactNode; subtitle?: React.ReactNode; actions?: React.ReactNode; children?: React.ReactNode, className?: string }) {
  return (
    <section className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {(title || subtitle || actions) && (
        <header className="flex flex-col gap-1 border-b border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h3 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h3>}
            {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-zinc-600">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/60",
        props.className
      )}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/60",
        props.className
      )}
    />
  );
}

function GhostButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/70 disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400/70 disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

function Badge({ children, variant = "muted" }: { children: React.ReactNode; variant?: "muted" | "success" | "warning" }) {
  const map = {
    muted: "bg-zinc-100 text-zinc-700 border-zinc-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
  } as const;
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", map[variant])}>{children}</span>;
}

function Alert({ kind = "info", children }: { kind?: "info" | "error" | "success"; children: React.ReactNode }) {
  const map = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  } as const;
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", map[kind])}>{children}</div>;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-zinc-200", className)} />;
}

function ImagePreview({ src, alt }: { src?: string; alt: string }) {
  if (!src) return <p className="text-xs text-zinc-500">Nessuna immagine.</p>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-36 w-full rounded-xl border border-zinc-200 object-cover" />;
}

// -------------------- Page --------------------
export default function ExperiencesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [parts, setParts] = useState<DynamicPart[]>([]);

  const titlePart = useMemo(() => parts.find((p) => p.page === "Home" && p.key === "experiences" && !p.parentId), [parts]);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [savingTitle, setSavingTitle] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newOrder, setNewOrder] = useState<number>(0);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [dpData, setDpData] = useState<DynamicPart | null>(null);

  const experienceItems = useMemo(
    () =>
      parts
        .filter((p) => p.page === "Home" && p.key === "experiences" && p.parentId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [parts]
  );

  useEffect(() => {
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [newFile]);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("/api/dynamic-parts?page=Home&parentId=all&key=experiences", { cache: "no-store" });
      if (!res.ok) throw new Error("Errore nel caricamento.");
      const data: DynamicPart[] = await res.json();
      setParts(data || []);
      const tp = data.find((p) => p.key === "experiences" && !p.parentId) || null;
      setDpData(tp);
      setSectionTitle(tp?.title || "Esperienze a Milano");
    } catch (e: any) {
      setErr(e?.message || "Errore di rete.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSectionTitle() {
    try {
      setSavingTitle(true);
      const fd = new FormData();
      fd.append("title", sectionTitle || "");
      fd.append("page", "Home");
      fd.append("key", "experiences");

      const res = await fetch(titlePart ? `/api/dynamic-parts/${titlePart._id}` : "/api/dynamic-parts", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore durante il salvataggio del titolo.");
      }
      await load();
    } catch (e: any) {
      alert(e?.message || "Errore durante il salvataggio.");
    } finally {
      setSavingTitle(false);
    }
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Inserisci il titolo del post.");
    if (!newFile) return alert("Seleziona un'immagine.");
    try {
      setCreating(true);
      const fd = new FormData();
      fd.append("page", "Home");
      fd.append("key", "experiences");
      fd.append("title", newTitle);
      if (dpData?._id) fd.append("parentId", dpData._id);
      fd.append("description", newDesc);
      fd.append("order", String(newOrder || 0));
      fd.append("image", newFile);

      const res = await fetch("/api/dynamic-parts", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore nella creazione del post.");
      }
      setNewTitle("");
      setNewDesc("");
      setNewOrder(0);
      setNewFile(null);
      await load();
    } catch (e: any) {
      alert(e?.message || "Errore nella creazione.");
    } finally {
      setCreating(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Eliminare questo post?")) return;
    try {
      const res = await fetch(`/api/dynamic-parts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore durante l'eliminazione.");
      }
      await load();
    } catch (e: any) {
      alert(e?.message || "Errore durante l'eliminazione.");
    }
  }

  const fmt = new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Esperienze a Milano</h1>
          <p className="text-xs text-zinc-500">Gestisci il titolo della sezione e i post dello slider.</p>
        </div>
        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={load}>Ricarica</GhostButton>
          <Link href="/" className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/70">Vai alla Home</Link>
        </div>
      </div>

      {loading && (
        <div className="mb-4">
          <Card>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </Card>
        </div>
      )}
      {err && (
        <div className="mb-4">
          <Alert kind="error">{err}</Alert>
        </div>
      )}

      {/* Titolo sezione */}
      <Card title="Titolo della sezione" subtitle="Questo titolo appare sopra lo slider.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="sectionTitle">Titolo</Label>
            <Input id="sectionTitle" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="Esperienze a Milano" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <PrimaryButton onClick={saveSectionTitle} disabled={savingTitle}>{savingTitle ? "Salvataggio…" : "Salva titolo"}</PrimaryButton>
        </div>
      </Card>

      {/* Nuovo post */}
      <form onSubmit={createPost} className="mt-6">
        <Card title="Nuovo post">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="newTitle">Titolo del post</Label>
              <Input id="newTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Es. Cena sul tram" />
            </div>
            <div>
              <Label htmlFor="newOrder">Ordine</Label>
              <Input id="newOrder" type="number" value={newOrder} onChange={(e) => setNewOrder(Number(e.target.value))} min={0} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="newDesc">Descrizione</Label>
              <Textarea id="newDesc" rows={4} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Testo del post" />
            </div>
            <div>
              <Label htmlFor="newImage">Immagine</Label>
              <Input id="newImage" type="file" accept="image/*" onChange={(e) => setNewFile(e.currentTarget.files?.[0] ?? null)} />
              <div className="mt-3">
                <ImagePreview src={preview || undefined} alt="Anteprima" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <PrimaryButton disabled={creating}>{creating ? "Creazione…" : "Crea post"}</PrimaryButton>
          </div>
        </Card>
      </form>

      {/* Elenco post */}
      <Card title="Elenco post" className="mt-6">
        {experienceItems.length === 0 ? (
          <p className="text-sm text-zinc-500">Nessun post. Aggiungi il primo dal modulo sopra.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">Titolo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">Stato</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">Ordine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">Aggiornato</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {experienceItems.map((it) => (
                  <tr key={it._id} className="hover:bg-zinc-50/70">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{it.title || "—"}</td>
                    <td className="px-4 py-3 text-sm">
                      {it.published ? <Badge variant="success">Pubblicato</Badge> : <Badge variant="warning">Bozza</Badge>}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-zinc-700">{it.order ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">{it.updatedAt ? fmt.format(new Date(it.updatedAt)) : "—"}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/dynamic-parts/${it._id}`} className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/70">Modifica</Link>
                        <GhostButton type="button" onClick={() => deletePost(it._id)}>Elimina</GhostButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick link */}
      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Vuoi vedere la sezione sul sito?</span>
            <Link href="/" className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/70">Vai alla Home</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
