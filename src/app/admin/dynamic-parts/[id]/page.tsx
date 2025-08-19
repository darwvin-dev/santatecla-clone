"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Page({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // داده‌های فرم
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

  // فایل‌های انتخاب‌شده (ارسال یک‌جا روی Submit)
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileMobileImage, setFileMobileImage] = useState<File | null>(null);
  const [fileImage2, setFileImage2] = useState<File | null>(null);
  const [fileMobileImage2, setFileMobileImage2] = useState<File | null>(null);

  const update = (k: keyof DP, v: any) => setForm((s) => ({ ...s, [k]: v }));

  // پیش‌نمایش‌ها
  const previewImage = useMemo(
    () => (fileImage ? URL.createObjectURL(fileImage) : form.image || ""),
    [fileImage, form.image]
  );
  const previewMobileImage = useMemo(
    () =>
      fileMobileImage
        ? URL.createObjectURL(fileMobileImage)
        : form.mobileImage || "",
    [fileMobileImage, form.mobileImage]
  );
  const previewImage2 = useMemo(
    () => (fileImage2 ? URL.createObjectURL(fileImage2) : form.image2 || ""),
    [fileImage2, form.image2]
  );
  const previewMobileImage2 = useMemo(
    () =>
      fileMobileImage2
        ? URL.createObjectURL(fileMobileImage2)
        : form.mobileImage2 || "",
    [fileMobileImage2, form.mobileImage2]
  );

  // لود داده
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dynamic-parts/${id}`, {
          cache: "no-store",
        });
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

  // helper: اگر فایل هست، فایل را بفرست؛ اگر می‌خواهی پاک کنی رشته‌ی خالی بفرست؛ وگرنه URL موجود
  function appendForPut(
    fd: FormData,
    name: keyof DP,
    file: File | null,
    currentUrl?: string
  ) {
    if (file) {
      fd.append(String(name), file);
    } else if (currentUrl !== undefined) {
      fd.append(String(name), currentUrl); // حتی "" برای پاک‌کردن
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      if (!form.key?.trim() || !form.page?.trim())
        throw new Error("Chiave e pagina sono obbligatorie.");

      const fd = new FormData();
      fd.append("key", form.key);
      fd.append("page", form.page);
      fd.append("title", form.title || "");
      fd.append("secondTitle", form.secondTitle || "");
      fd.append("description", form.description || "");
      fd.append("secondDescription", form.secondDescription || "");
      fd.append("order", String(form.order ?? 0));
      fd.append("published", form.published ?? true ? "true" : "false");

      // تصاویر
      appendForPut(fd, "image", fileImage, form.image);
      appendForPut(fd, "mobileImage", fileMobileImage, form.mobileImage);
      appendForPut(fd, "image2", fileImage2, form.image2);
      appendForPut(fd, "mobileImage2", fileMobileImage2, form.mobileImage2);

      const res = await fetch(`/api/dynamic-parts/${id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Errore durante il salvataggio.");
      }
      const updated: DP = await res.json();
      setForm((s) => ({ ...s, ...updated, order: Number(updated.order ?? 0) }));
      // بعد از موفقیت، فایل‌های انتخاب‌شده را خالی کن
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

  function removeImage(
    field: "image" | "mobileImage" | "image2" | "mobileImage2"
  ) {
    // پاک کردن: رشته‌ی خالی بگذار تا سرور فیلد را خالی کند
    update(field, "");
    // و فایل انتخابی آن فیلد را هم پاک کن
    if (field === "image") setFileImage(null);
    if (field === "mobileImage") setFileMobileImage(null);
    if (field === "image2") setFileImage2(null);
    if (field === "mobileImage2") setFileMobileImage2(null);
  }

  if (loading) {
    return (
      <div className="adminap-page">
        <div className="adminap-form">
          <h1 className="adminap-title">Modifica Sezione</h1>
          <div className="adminap-card">
            <div className="adminap-muted">Caricamento…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adminap-page">
      <div className="adminap-form">
        <h1 className="adminap-title">Modifica Sezione — {form.key || "—"}</h1>

        <form onSubmit={onSubmit}>
          {/* Metadati */}
          <div className="adminap-card">
            <h3 className="adminap-card-title">Metadati</h3>
            <div className="adminap-grid-3">
              <div>
                <label className="adminap-label">Chiave (key)</label>
                <input
                  className="adminap-input"
                  value={form.key}
                  onChange={(e) => update("key", e.target.value)}
                  placeholder="hero, about, features…"
                  required
                />
                <div className="adminap-muted">
                  Identificatore tecnico della sezione.
                </div>
              </div>
              <div>
                <label className="adminap-label">Pagina (page)</label>
                <input
                  className="adminap-input"
                  value={form.page}
                  onChange={(e) => update("page", e.target.value)}
                  placeholder="Home"
                  required
                />
                <div className="adminap-muted">Es. Home</div>
              </div>
              <div>
                <label className="adminap-label">Ordine</label>
                <input
                  type="number"
                  className="adminap-input"
                  value={form.order ?? 0}
                  onChange={(e) => update("order", Number(e.target.value))}
                  min={0}
                />
                <div className="adminap-muted">
                  Ordine di visualizzazione nella pagina.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label
                className="adminap-label"
                style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={form.published ?? true}
                  onChange={(e) => update("published", e.target.checked)}
                  style={{ transform: "scale(1.1)" }}
                />
                Pubblicato
              </label>
            </div>
          </div>

          {/* Contenuti testuali */}
          <div className="adminap-card">
            <h3 className="adminap-card-title">Contenuti testuali</h3>
            <div className="adminap-grid-2">
              <div>
                <label className="adminap-label">Titolo</label>
                <textarea
                  className="adminap-textarea"
                  rows={2}
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Titolo principale (Invio per nuova riga)"
                />
              </div>
              <div>
                <label className="adminap-label">Secondo titolo</label>
                <textarea
                  className="adminap-textarea"
                  rows={2}
                  value={form.secondTitle}
                  onChange={(e) => update("secondTitle", e.target.value)}
                  placeholder="Sottotitolo / riga secondaria"
                />
              </div>
              <div>
                <label className="adminap-label">Descrizione</label>
                <textarea
                  className="adminap-textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Testo descrittivo"
                />
              </div>
              <div>
                <label className="adminap-label">Seconda descrizione</label>
                <textarea
                  className="adminap-textarea"
                  rows={3}
                  value={form.secondDescription}
                  onChange={(e) => update("secondDescription", e.target.value)}
                  placeholder="Testo descrittivo secondario"
                />
              </div>
            </div>
          </div>

          {/* Immagini */}
          <div className="adminap-card">
            <h3 className="adminap-card-title">Immagini</h3>

            {/* Riga 1 */}
            <div className="adminap-grid-2">
              {/* Desktop */}
              <div>
                <label className="adminap-label">
                  Immagine desktop (image)
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <input
                    className="adminap-input-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileImage(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    className="adminap-btn-ghost"
                    onClick={() => removeImage("image")}
                  >
                    Rimuovi
                  </button>
                </div>
                {previewImage ? (
                  <div
                    className="adminap-image-preview"
                    style={{ marginTop: 6 }}
                  >
                    <img src={previewImage} alt="Anteprima desktop" />
                  </div>
                ) : (
                  <div className="adminap-muted">Nessuna immagine.</div>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="adminap-label">
                  Immagine mobile (mobileImage)
                </label>
                <input
                  className="adminap-input"
                  value={form.mobileImage || ""}
                  onChange={(e) => update("mobileImage", e.target.value)}
                  placeholder="URL o lascia vuoto e carica file"
                />
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <button
                    type="button"
                    className="adminap-btn-ghost"
                    onClick={() => removeImage("mobileImage")}
                  >
                    Rimuovi
                  </button>
                </div>
                {previewMobileImage ? (
                  <div
                    className="adminap-image-preview"
                    style={{ marginTop: 6 }}
                  >
                    <img src={previewMobileImage} alt="Anteprima mobile" />
                  </div>
                ) : (
                  <div className="adminap-muted">Nessuna immagine.</div>
                )}
              </div>
            </div>

            {/* Riga 2 */}
            <div className="adminap-grid-2" style={{ marginTop: 12 }}>
              {/* Desktop 2 */}
              <div>
                <label className="adminap-label">Immagine 2 (image2)</label>
                <input
                  className="adminap-input"
                  value={form.image2 || ""}
                  onChange={(e) => update("image2", e.target.value)}
                  placeholder="URL o file (facoltativo)"
                />
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <button
                    type="button"
                    className="adminap-btn-ghost"
                    onClick={() => removeImage("image2")}
                  >
                    Rimuovi
                  </button>
                </div>
                {previewImage2 ? (
                  <div
                    className="adminap-image-preview"
                    style={{ marginTop: 6 }}
                  >
                    <img src={previewImage2} alt="Anteprima desktop 2" />
                  </div>
                ) : (
                  <div className="adminap-muted">Nessuna immagine.</div>
                )}
              </div>

              {/* Mobile 2 */}
              <div>
                <label className="adminap-label">
                  Immagine mobile 2 (mobileImage2)
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <input
                    className="adminap-input-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFileMobileImage2(e.target.files?.[0] ?? null)
                    }
                  />
                  <button
                    type="button"
                    className="adminap-btn-ghost"
                    onClick={() => removeImage("mobileImage2")}
                  >
                    Rimuovi
                  </button>
                </div>
                {previewMobileImage2 ? (
                  <div
                    className="adminap-image-preview"
                    style={{ marginTop: 6 }}
                  >
                    <img src={previewMobileImage2} alt="Anteprima mobile 2" />
                  </div>
                ) : (
                  <div className="adminap-muted">Nessuna immagine.</div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div
              className="adminap-card"
              style={{ borderColor: "var(--danger)" }}
            >
              <div className="adminap-muted" style={{ color: "var(--danger)" }}>
                {error}
              </div>
            </div>
          )}
          {saved && (
            <div
              className="adminap-card"
              style={{ borderColor: "var(--accent)" }}
            >
              <div className="adminap-muted" style={{ color: "var(--accent)" }}>
                Salvato con successo.
              </div>
            </div>
          )}

          <div
            className="adminap-form-actions"
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              className="adminap-btn-ghost"
              onClick={() => router.push("/admin/homepage")}
            >
              ← Indice
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="adminap-btn-ghost"
                onClick={() => history.back()}
                aria-disabled={saving}
              >
                Annulla
              </button>
              <button
                className="adminap-btn-primary"
                disabled={saving}
                aria-disabled={saving}
              >
                {saving ? "Salvataggio…" : "Salva"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
