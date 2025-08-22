"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// -------------------- Types --------------------

type FormDataShape = {
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
  image3?: string;
  mobileImage3?: string;
  order?: number;
  published?: boolean;
};

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

export default function Page() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<FormDataShape>({
    key: "hero",
    page: "Home",
    title: "",
    secondTitle: "",
    description: "",
    secondDescription: "",
    image: "",
    mobileImage: "",
    image2: "",
    mobileImage2: "",
    image3: "",
    mobileImage3: "",
    order: 0,
    published: true,
  });

  const update = (k: keyof FormDataShape, v: any) => setForm((s) => ({ ...s, [k]: v }));

  // file states
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileMobileImage, setFileMobileImage] = useState<File | null>(null);
  const [fileImage2, setFileImage2] = useState<File | null>(null);
  const [fileMobileImage2, setFileMobileImage2] = useState<File | null>(null);
  const [fileImage3, setFileImage3] = useState<File | null>(null);
  const [fileMobileImage3, setFileMobileImage3] = useState<File | null>(null);

  // previews
  const previewImage = useMemo(() => (fileImage ? URL.createObjectURL(fileImage) : form.image || ""), [fileImage, form.image]);
  const previewMobileImage = useMemo(() => (fileMobileImage ? URL.createObjectURL(fileMobileImage) : form.mobileImage || ""), [fileMobileImage, form.mobileImage]);
  const previewImage2 = useMemo(() => (fileImage2 ? URL.createObjectURL(fileImage2) : form.image2 || ""), [fileImage2, form.image2]);
  const previewMobileImage2 = useMemo(() => (fileMobileImage2 ? URL.createObjectURL(fileMobileImage2) : form.mobileImage2 || ""), [fileMobileImage2, form.mobileImage2]);
  const previewImage3 = useMemo(() => (fileImage3 ? URL.createObjectURL(fileImage3) : form.image3 || ""), [fileImage3, form.image3]);
  const previewMobileImage3 = useMemo(() => (fileMobileImage3 ? URL.createObjectURL(fileMobileImage3) : form.mobileImage3 || ""), [fileMobileImage3, form.mobileImage3]);

  function appendFileOrUrl(fd: FormData, name: keyof FormDataShape, file: File | null, url?: string) {
    if (file) fd.append(String(name), file);
    else if (url) fd.append(String(name), url);
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

      appendFileOrUrl(fd, "image", fileImage, form.image);
      appendFileOrUrl(fd, "mobileImage", fileMobileImage, form.mobileImage);
      appendFileOrUrl(fd, "image2", fileImage2, form.image2);
      appendFileOrUrl(fd, "mobileImage2", fileMobileImage2, form.mobileImage2);
      appendFileOrUrl(fd, "image3", fileImage3, form.image3);
      appendFileOrUrl(fd, "mobileImage3", fileMobileImage3, form.mobileImage3);

      const res = await fetch("/api/dynamic-parts", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore durante il salvataggio.");
      }
      const created = await res.json();
      setSaved(true);
      router.push(`/admin/dynamic-parts/${created._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function removeImage(field: keyof Pick<FormDataShape, "image" | "mobileImage" | "image2" | "mobileImage2" | "image3" | "mobileImage3">) {
    update(field, "");
    if (field === "image") setFileImage(null);
    if (field === "mobileImage") setFileMobileImage(null);
    if (field === "image2") setFileImage2(null);
    if (field === "mobileImage2") setFileMobileImage2(null);
    if (field === "image3") setFileImage3(null);
    if (field === "mobileImage3") setFileMobileImage3(null);
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Top actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Nuova Sezione — Home</h1>
          <p className="text-xs text-zinc-500">Compila i campi e crea una nuova sezione dinamica.</p>
        </div>
        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={() => router.push("/admin/homepage")}>← Indice</GhostButton>
          <GhostButton type="button" onClick={() => history.back()}>Annulla</GhostButton>
          <PrimaryButton type="submit" form="dp-new-form" disabled={saving}>{saving ? "Salvataggio…" : "Crea"}</PrimaryButton>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}
      {saved && (
        <div className="mb-4">
          <Alert kind="success">Creato con successo.</Alert>
        </div>
      )}

      <form id="dp-new-form" onSubmit={onSubmit} className="space-y-6">
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
              <div className="mt-2 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setFileMobileImage(e.currentTarget.files?.[0] ?? null)} />
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
              <div className="mt-2 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setFileImage2(e.currentTarget.files?.[0] ?? null)} />
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

          {/* Row 3 */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Desktop 3 */}
            <div>
              <Label>Immagine 3 (image3)</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setFileImage3(e.currentTarget.files?.[0] ?? null)} />
                <GhostButton type="button" onClick={() => removeImage("image3")}>Rimuovi</GhostButton>
              </div>
              <div className="mt-3">
                <ImagePreview src={previewImage3} alt="Anteprima desktop 3" />
              </div>
            </div>

            {/* Mobile 3 */}
            <div>
              <Label>Immagine mobile 3 (mobileImage3)</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setFileMobileImage3(e.currentTarget.files?.[0] ?? null)} />
                <GhostButton type="button" onClick={() => removeImage("mobileImage3")}>Rimuovi</GhostButton>
              </div>
              <div className="mt-3">
                <ImagePreview src={previewMobileImage3} alt="Anteprima mobile 3" />
              </div>
            </div>
          </div>
        </Card>
      </form>

      {/* Sticky actions for mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 sm:hidden">
        <div className="pointer-events-auto mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-end gap-2">
            <GhostButton type="button" onClick={() => router.push("/admin/homepage")}>
              ← Indice
            </GhostButton>
            <GhostButton type="button" onClick={() => history.back()}>Annulla</GhostButton>
            <PrimaryButton type="submit" form="dp-new-form" disabled={saving}>
              {saving ? "Salvataggio…" : "Crea"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
