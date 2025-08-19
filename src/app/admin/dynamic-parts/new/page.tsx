// /app/admin/home/dynamic-parts/new/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  image3?: string;         // ✅ جدید
  mobileImage3?: string;   // ✅ جدید
  order?: number;
  published?: boolean;
};

export default function NewDynamicPartPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    image3: "",            // ✅
    mobileImage3: "",      // ✅
    order: 0,
    published: true,
  });

  // فایل‌های انتخاب‌شده
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileMobileImage, setFileMobileImage] = useState<File | null>(null);
  const [fileImage2, setFileImage2] = useState<File | null>(null);
  const [fileMobileImage2, setFileMobileImage2] = useState<File | null>(null);
  const [fileImage3, setFileImage3] = useState<File | null>(null);               // ✅
  const [fileMobileImage3, setFileMobileImage3] = useState<File | null>(null);   // ✅

  const update = (k: keyof FormDataShape, v: any) =>
    setForm((s) => ({ ...s, [k]: v }));

  // پیش‌نمایش لوکال
  const previewImage = useMemo(
    () => (fileImage ? URL.createObjectURL(fileImage) : form.image || ""),
    [fileImage, form.image]
  );
  const previewMobileImage = useMemo(
    () => (fileMobileImage ? URL.createObjectURL(fileMobileImage) : form.mobileImage || ""),
    [fileMobileImage, form.mobileImage]
  );
  const previewImage2 = useMemo(
    () => (fileImage2 ? URL.createObjectURL(fileImage2) : form.image2 || ""),
    [fileImage2, form.image2]
  );
  const previewMobileImage2 = useMemo(
    () => (fileMobileImage2 ? URL.createObjectURL(fileMobileImage2) : form.mobileImage2 || ""),
    [fileMobileImage2, form.mobileImage2]
  );
  const previewImage3 = useMemo(                               // ✅
    () => (fileImage3 ? URL.createObjectURL(fileImage3) : form.image3 || ""),
    [fileImage3, form.image3]
  );
  const previewMobileImage3 = useMemo(                          // ✅
    () => (fileMobileImage3 ? URL.createObjectURL(fileMobileImage3) : form.mobileImage3 || ""),
    [fileMobileImage3, form.mobileImage3]
  );

  // اگر فایل وجود داشت همان را می‌فرستیم؛ وگرنه مقدار رشته‌ای (URL) را
  function appendFileOrUrl(fd: FormData, name: string, file: File | null, url?: string) {
    if (file) fd.append(name, file);
    else if (url) fd.append(name, url);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!form.key?.trim() || !form.page?.trim()) {
        throw new Error("Chiave e pagina sono obbligatorie.");
      }

      const fd = new FormData();
      fd.append("key", form.key);
      fd.append("page", form.page);
      fd.append("title", form.title || "");
      fd.append("secondTitle", form.secondTitle || "");
      fd.append("description", form.description || "");
      fd.append("secondDescription", form.secondDescription || "");
      fd.append("order", String(form.order ?? 0));
      fd.append("published", (form.published ?? true) ? "true" : "false");

      appendFileOrUrl(fd, "image", fileImage, form.image);
      appendFileOrUrl(fd, "mobileImage", fileMobileImage, form.mobileImage);
      appendFileOrUrl(fd, "image2", fileImage2, form.image2);
      appendFileOrUrl(fd, "mobileImage2", fileMobileImage2, form.mobileImage2);
      appendFileOrUrl(fd, "image3", fileImage3, form.image3);                 // ✅
      appendFileOrUrl(fd, "mobileImage3", fileMobileImage3, form.mobileImage3); // ✅

      const res = await fetch("/api/dynamic-parts", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore durante il salvataggio.");
      }
      const created = await res.json();
      router.push(`/admin/dynamic-parts/${created._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adminap-page">
      <div className="adminap-form">
        <h1 className="adminap-title">Nuova Sezione — Home</h1>

        <form onSubmit={onSubmit}>
          {/* Metadati */}
          <div className="adminap-card">
            <h3 className="adminap-card-title">Metadati</h3>
            <div className="adminap-grid-3">
              <div>
                <label className="adminap-label">Chiave (key)</label>
                <input className="adminap-input" value={form.key} onChange={(e) => update("key", e.target.value)} placeholder="hero, about, features…" required />
                <div className="adminap-muted">Identificatore tecnico della sezione.</div>
              </div>
              <div>
                <label className="adminap-label">Pagina (page)</label>
                <input className="adminap-input" value={form.page} onChange={(e) => update("page", e.target.value)} placeholder="Home" required />
                <div className="adminap-muted">Per questa pagina usa “Home”.</div>
              </div>
              <div>
                <label className="adminap-label">Ordine</label>
                <input type="number" className="adminap-input" value={form.order ?? 0} onChange={(e) => update("order", Number(e.target.value))} min={0} />
                <div className="adminap-muted">Ordine di visualizzazione nella pagina.</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="adminap-label" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={form.published ?? true} onChange={(e) => update("published", e.target.checked)} style={{ transform: "scale(1.1)" }} />
                Pubblicato
              </label>
            </div>
          </div>

          {/* Testi */}
          <div className="adminap-card">
            <h3 className="adminap-card-title">Contenuti testuali</h3>
            <div className="adminap-grid-2">
              <div>
                <label className="adminap-label">Titolo</label>
                <textarea className="adminap-textarea" rows={2} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Titolo principale (Invio per nuova riga)" />
              </div>
              <div>
                <label className="adminap-label">Secondo titolo</label>
                <textarea className="adminap-textarea" rows={2} value={form.secondTitle} onChange={(e) => update("secondTitle", e.target.value)} placeholder="Sottotitolo / riga secondaria" />
              </div>
              <div>
                <label className="adminap-label">Descrizione</label>
                <textarea className="adminap-textarea" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Testo descrittivo" />
              </div>
              <div>
                <label className="adminap-label">Seconda descrizione</label>
                <textarea className="adminap-textarea" rows={3} value={form.secondDescription} onChange={(e) => update("secondDescription", e.target.value)} placeholder="Testo descrittivo secondario" />
              </div>
            </div>
          </div>

          {/* Immagini */}
          <div className="adminap-card">
            <h3 className="adminap-card-title">Immagini</h3>

            {/* Riga 1 */}
            <div className="adminap-grid-2">
              <div>
                <label className="adminap-label">Immagine desktop (image)</label>
                <input className="adminap-input-file" type="file" accept="image/*" onChange={(e) => setFileImage(e.target.files?.[0] ?? null)} />
                {previewImage ? <div className="adminap-image-preview" style={{ marginTop: 6 }}><img src={previewImage} alt="Anteprima desktop" /></div> : <div className="adminap-muted">URL o file.</div>}
              </div>

              <div>
                <label className="adminap-label">Immagine mobile (mobileImage)</label>
                <input className="adminap-input-file" type="file" accept="image/*" onChange={(e) => setFileMobileImage(e.target.files?.[0] ?? null)} />
                {previewMobileImage ? <div className="adminap-image-preview" style={{ marginTop: 6 }}><img src={previewMobileImage} alt="Anteprima mobile" /></div> : <div className="adminap-muted">URL o file.</div>}
              </div>
            </div>

            {/* Riga 2 */}
            <div className="adminap-grid-2" style={{ marginTop: 12 }}>
              <div>
                <label className="adminap-label">Immagine 2 (image2)</label>
                <input className="adminap-input-file" type="file" accept="image/*" onChange={(e) => setFileImage2(e.target.files?.[0] ?? null)} />
                {previewImage2 ? <div className="adminap-image-preview" style={{ marginTop: 6 }}><img src={previewImage2} alt="Anteprima desktop 2" /></div> : <div className="adminap-muted">Facoltativo.</div>}
              </div>

              <div>
                <label className="adminap-label">Immagine mobile 2 (mobileImage2)</label>
                <input className="adminap-input-file" type="file" accept="image/*" onChange={(e) => setFileMobileImage2(e.target.files?.[0] ?? null)} />
                {previewMobileImage2 ? <div className="adminap-image-preview" style={{ marginTop: 6 }}><img src={previewMobileImage2} alt="Anteprima mobile 2" /></div> : <div className="adminap-muted">Facoltativo.</div>}
              </div>
            </div>

            {/* ✅ Riga 3: Immagine 3 */}
            <div className="adminap-grid-2" style={{ marginTop: 12 }}>
              <div>
                <label className="adminap-label">Immagine 3 (image3)</label>
                <input className="adminap-input-file" type="file" accept="image/*" onChange={(e) => setFileImage3(e.target.files?.[0] ?? null)} />
                {previewImage3 ? <div className="adminap-image-preview" style={{ marginTop: 6 }}><img src={previewImage3} alt="Anteprima desktop 3" /></div> : <div className="adminap-muted">Facoltativo.</div>}
              </div>

              <div>
                <label className="adminap-label">Immagine mobile 3 (mobileImage3)</label>
                <input className="adminap-input-file" type="file" accept="image/*" onChange={(e) => setFileMobileImage3(e.target.files?.[0] ?? null)} />
                {previewMobileImage3 ? <div className="adminap-image-preview" style={{ marginTop: 6 }}><img src={previewMobileImage3} alt="Anteprima mobile 3" /></div> : <div className="adminap-muted">Facoltativo.</div>}
              </div>
            </div>
          </div>

          {error && (
            <div className="adminap-card" style={{ borderColor: "var(--danger)" }}>
              <div className="adminap-muted" style={{ color: "var(--danger)" }}>{error}</div>
            </div>
          )}

          <div className="adminap-form-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="adminap-btn-primary" disabled={saving} aria-disabled={saving}>
              {saving ? "Salvataggio…" : "Crea"}
            </button>
            <button type="button" className="adminap-btn-ghost" onClick={() => history.back()} aria-disabled={saving}>
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
