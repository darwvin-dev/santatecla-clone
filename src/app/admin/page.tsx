"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// -------------------- Types --------------------

type DP = {
  _id: string;
  key: string;
  page: string;
  title?: string;
  secondTitle?: string;
  description?: string;
  secondDescription?: string;
  image?: string;
  mobileImage?: string;
  image2?: string;
  mobileImage2?: string;
  order?: number;
  published?: boolean;
  updatedAt?: string;
};

type RouteParams = { id: string };

// -------------------- UI primitives --------------------

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
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

function Card({ title, subtitle, children }: { title?: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {(title || subtitle) && (
        <header className="border-b border-zinc-200 px-4 py-3">
          {title && <h3 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h3>}
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </header>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Alert({ kind = "info", children }: { kind?: "info" | "error" | "success"; children: React.ReactNode }) {
  const map = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  } as const;
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", map[kind])}>{children}</div>;
}

function ImagePreview({ src, alt }: { src?: string; alt: string }) {
  if (!src) return <p className="text-xs text-zinc-500">Nessuna immagine.</p>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-40 w-full rounded-xl border border-zinc-200 object-cover" />;
}

// -------------------- Page --------------------

export default function Page({ params }: { params: Promise<RouteParams> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // form state
  const [form, setForm] = useState<DP>({
    _id: id,
    key: "",
    page: "Home",
    title: "",
    secondTitle: "",
    description: "",
    secondDescription: "",
    image: "",
    mobileImage: "",
    image2: "",
    mobileImage2: "",
    order: 0,
    published: true,
  });

  // file states
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileMobileImage, setFileMobileImage] = useState<File | null>(null);
  const [fileImage2, setFileImage2] = useState<File | null>(null);
  const [fileMobileImage2, setFileMobileImage2] = useState<File | null>(null);

  const update = (k: keyof DP, v: any) => setForm((s) => ({ ...s, [k]: v }));

  // previews
  const previewImage = useMemo(() => (fileImage ? URL.createObjectURL(fileImage) : form.image || ""), [fileImage, form.image]);
  const previewMobileImage = useMemo(() => (fileMobileImage ? URL.createObjectURL(fileMobileImage) : form.mobileImage || ""), [fileMobileImage, form.mobileImage]);
  const previewImage2 = useMemo(() => (fileImage2 ? URL.createObjectURL(fileImage2) : form.image2 || ""), [fileImage2, form.image2]);
  const previewMobileImage2 = useMemo(() => (fileMobileImage2 ? URL.createObjectURL(fileMobileImage2) : form.mobileImage2 || ""), [fileMobileImage2, form.mobileImage2]);

  // load data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dynamic-parts/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Impossibile caricare i dati.");
        const data: DP = await res.json();
        setForm({
          _id: data._id,
          key: data.key,
          page: data.page,
          title: data.title || "",
          secondTitle: data.secondTitle || "",
          description: data.description || "",
          secondDescription: data.secondDescription || "",
          image: data.image || "",
          mobileImage: data.mobileImage || "",
          image2: data.image2 || "",
          mobileImage2: data.mobileImage2 || "",
          order: Number(data.order ?? 0),
          published: Boolean(data.published ?? true),
          updatedAt: data.updatedAt,
        });
      } catch (e: any) {
        setError(e?.message || "Errore di caricamento.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function appendForPut(fd: FormData, name: keyof DP, file: File | null, currentUrl?: string) {
    if (file) {
      fd.append(String(name), file);
    } else if (currentUrl !== undefined) {
      fd.append(String(name), currentUrl);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      if (!form.key?.trim() || !form.page?.trim()) throw new Error("Chiave e pagina sono obbligatorie.");

      const fd = new FormData();
      fd.append("key", form.key);
      fd.append("page", form.page);
      fd.append("title", form.title || "");
      fd.append("secondTitle", form.secondTitle || "");
      fd.append("description", form.description || "");
      fd.append("secondDescription", form.secondDescription || "");
      fd.append("order", String(form.order ?? 0));
      fd.append("published", form.published ?? true ? "true" : "false");

      appendForPut(fd, "image", fileImage, form.image);
      appendForPut(fd, "mobileImage", fileMobileImage, form.mobileImage);
      appendForPut(fd, "image2", fileImage2, form.image2);
      appendForPut(fd, "mobileImage2", fileMobileImage2, form.mobileImage2);

      const res = await fetch(`/api/dynamic-parts/${id}`, { method: "PUT", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore durante il salvataggio.");
      }
      const updated: DP = await res.json();
      setForm((s) => ({ ...s, ...updated, order: Number(updated.order ?? 0) }));
      setFileImage(null);
      setFileMobileImage(null);
      setFileImage2(null);
      setFileMobileImage2(null);
      setSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function removeImage(field: "image" | "mobileImage" | "image2" | "mobileImage2") {
    update(field, "");
    if (field === "image") setFileImage(null);
    if (field === "mobileImage") setFileMobileImage(null);
    if (field === "image2") setFileImage2(null);
    if (field === "mobileImage2") setFileMobileImage2(null);
  }

  const fmt = new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" });

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-4 text-lg font-semibold">Modifica Sezione</div>
        <Card>
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
            <div className="h-5 w-3/5 animate-pulse rounded bg-zinc-200" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-zinc-200" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Top actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Modifica Sezione — {form.key || "—"}</h1>
          {form.updatedAt && (
            <p className="text-xs text-zinc-500">Ultimo aggiornamento: {fmt.format(new Date(form.updatedAt))}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={() => router.push("/admin/homepage")}>← Indice</GhostButton>
          <GhostButton type="button" onClick={() => history.back()}>Annulla</GhostButton>
          <PrimaryButton type="submit" form="dp-form" disabled={saving}>{saving ? "Salvataggio…" : "Salva"}</PrimaryButton>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}
      {saved && (
        <div className="mb-4">
          <Alert kind="success">Salvato con successo.</Alert>
        </div>
      )}

      <form id="dp-form" onSubmit={onSubmit} className="space-y-6">
        {/* Metadati */}
        <Card title="Metadati">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="key">Chiave (key)</Label>
              <Input id="key" value={form.key} onChange={(e) => update("key", e.target.value)} placeholder="hero, about, features…" required />
              <p className="mt-1 text-xs text-zinc-500">Identificatore tecnico della sezione.</p>
            </div>
            <div>
              <Label htmlFor="page">Pagina (page)</Label>
              <Input id="page" value={form.page} onChange={(e) => update("page", e.target.value)} placeholder="Home" required />
              <p className="mt-1 text-xs text-zinc-500">Es. Home</p>
            </div>
            <div>
              <Label htmlFor="order">Ordine</Label>
              <Input id="order" type="number" value={form.order ?? 0} onChange={(e) => update("order", Number(e.target.value))} min={0} />
              <p className="mt-1 text-xs text-zinc-500">Ordine di visualizzazione nella pagina.</p>
            </div>
          </div>

          <div className="mt-3">
            <label className="inline-flex select-none items-center gap-2 text-sm text-zinc-800">
              <input
                type="checkbox"
                checked={form.published ?? true}
                onChange={(e) => update("published", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-400/60"
              />
              Pubblicato
            </label>
          </div>
        </Card>

        {/* Contenuti testuali */}
        <Card title="Contenuti testuali">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Titolo</Label>
              <Textarea id="title" rows={2} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Titolo principale (Invio per nuova riga)" />
            </div>
            <div>
              <Label htmlFor="secondTitle">Secondo titolo</Label>
              <Textarea id="secondTitle" rows={2} value={form.secondTitle} onChange={(e) => update("secondTitle", e.target.value)} placeholder="Sottotitolo / riga secondaria" />
            </div>
            <div>
              <Label htmlFor="description">Descrizione</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Testo descrittivo" />
            </div>
            <div>
              <Label htmlFor="secondDescription">Seconda descrizione</Label>
              <Textarea id="secondDescription" rows={3} value={form.secondDescription} onChange={(e) => update("secondDescription", e.target.value)} placeholder="Testo descrittivo secondario" />
            </div>
          </div>
        </Card>

        {/* Immagini */}
        <Card title="Immagini">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Desktop */}
            <div>
              <Label>Immagine desktop (image)</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setFileImage(e.currentTarget.files?.[0] ?? null)} />
                <GhostButton type="button" onClick={() => removeImage("image")}>Rimuovi</GhostButton>
              </div>
              <div className="mt-3">
                <ImagePreview src={previewImage} alt="Anteprima desktop" />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <Label>Immagine mobile (mobileImage)</Label>
              <Input value={form.mobileImage || ""} onChange={(e) => update("mobileImage", e.target.value)} placeholder="URL o lascia vuoto e carica file" />
              <div className="mt-2">
                <GhostButton type="button" onClick={() => removeImage("mobileImage")}>Rimuovi</GhostButton>
              </div>
              <div className="mt-3">
                <ImagePreview src={previewMobileImage} alt="Anteprima mobile" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Desktop 2 */}
            <div>
              <Label>Immagine 2 (image2)</Label>
              <Input value={form.image2 || ""} onChange={(e) => update("image2", e.target.value)} placeholder="URL o file (facoltativo)" />
              <div className="mt-2">
                <GhostButton type="button" onClick={() => removeImage("image2")}>Rimuovi</GhostButton>
              </div>
              <div className="mt-3">
                <ImagePreview src={previewImage2} alt="Anteprima desktop 2" />
              </div>
            </div>

            {/* Mobile 2 */}
            <div>
              <Label>Immagine mobile 2 (mobileImage2)</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setFileMobileImage2(e.currentTarget.files?.[0] ?? null)} />
                <GhostButton type="button" onClick={() => removeImage("mobileImage2")}>Rimuovi</GhostButton>
              </div>
              <div className="mt-3">
                <ImagePreview src={previewMobileImage2} alt="Anteprima mobile 2" />
              </div>
            </div>
          </div>
        </Card>
      </form>

      {/* Sticky actions for mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 sm:hidden">
        <div className="pointer-events-auto mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-end gap-2">
            <GhostButton type="button" onClick={() => router.push("/admin/homepage")}>← Indice</GhostButton>
            <GhostButton type="button" onClick={() => history.back()}>Annulla</GhostButton>
            <PrimaryButton type="submit" form="dp-form" disabled={saving}>{saving ? "Salvataggio…" : "Salva"}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
