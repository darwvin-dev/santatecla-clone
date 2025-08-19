"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicPart } from "@/types/DynamicPart";

export default function ExperiencesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [parts, setParts] = useState<DynamicPart[]>([]);

  const titlePart = useMemo(
    () => parts.find((p) => p.page === "Home" && p.key === "experiences"),
    [parts]
  );
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [savingTitle, setSavingTitle] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newOrder, setNewOrder] = useState<number>(0);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [dpData, setDpData] = useState<DynamicPart | null>(null);

  const experienceItems = useMemo(
    () =>
      parts
        .filter((p) => p.page === "Home" && p.key === "experiences")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [parts]
  );

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("/api/dynamic-parts?page=Home&parentId=all&key=experiences", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Errore nel caricamento.");
      const data: DynamicPart[] = await res.json();
      setParts(data.filter(p=> p.parentId) || []);
      const tp = data.find((p) => p.key === "experiences" && !p.parentId);
      setDpData(tp)
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

      const res = await fetch(
        titlePart
          ? `/api/dynamic-parts/${titlePart._id}`
          : "/api/dynamic-parts",
        { method: "POST", body: fd }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(
          j?.error || "Errore durante il salvataggio del titolo."
        );
      }
      await load();
    } catch (e: any) {
      alert(e?.message || "Errore durante il salvataggio.");
    } finally {
      setSavingTitle(false);
    }
  }

  // ---- crea nuovo post
  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Inserisci il titolo del post.");
      return;
    }
    if (!newFile) {
      alert("Seleziona un'immagine.");
      return;
    }
    try {
      setCreating(true);
      const fd = new FormData();
      fd.append("page", "Home");
      fd.append("key", "experiences");
      fd.append("title", newTitle);
      fd.append("parentId", dpData?._id);
      fd.append("description", newDesc);
      fd.append("order", String(newOrder || 0));
      fd.append("image", newFile);

      const res = await fetch("/api/dynamic-parts", {
        method: "POST",
        body: fd,
      });
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

  return (
    <div className="adminap-page">
      <div className="adminap-form">
        <h1 className="adminap-title">Esperienze a Milano</h1>

        {/* Stato generale */}
        {loading && (
          <div className="adminap-card">
            <div className="adminap-muted">Caricamento…</div>
          </div>
        )}
        {err && (
          <div
            className="adminap-card"
            style={{ borderColor: "var(--danger)" }}
          >
            <div className="adminap-muted" style={{ color: "var(--danger)" }}>
              {err}
            </div>
          </div>
        )}

        {/* Titolo sezione */}
        <div className="adminap-card">
          <h3 className="adminap-card-title">Titolo della sezione</h3>
          <div className="adminap-grid-2">
            <div className="adminap-col-span">
              <label className="adminap-label">Titolo</label>
              <input
                className="adminap-input"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Esperienze a Milano"
              />
              <div className="adminap-muted">
                Questo titolo appare sopra lo slider.
              </div>
            </div>
          </div>

          <div
            className="adminap-form-actions"
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <button
              className="adminap-btn-primary"
              onClick={saveSectionTitle}
              disabled={savingTitle}
              aria-disabled={savingTitle}
            >
              {savingTitle ? "Salvataggio…" : "Salva titolo"}
            </button>
          </div>
        </div>

        {/* Nuovo post */}
        <form onSubmit={createPost} className="adminap-card">
          <h3 className="adminap-card-title">Nuovo post</h3>
          <div className="adminap-grid-2">
            <div>
              <label className="adminap-label">Titolo del post</label>
              <input
                className="adminap-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Es. Cena sul tram"
              />
            </div>
            <div>
              <label className="adminap-label">Ordine</label>
              <input
                type="number"
                className="adminap-input"
                value={newOrder}
                onChange={(e) => setNewOrder(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="adminap-col-span">
              <label className="adminap-label">Descrizione</label>
              <textarea
                className="adminap-textarea"
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Testo del post"
              />
            </div>
            <div>
              <label className="adminap-label">Immagine</label>
              <input
                className="adminap-input-file"
                type="file"
                accept="image/*"
                onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div
            className="adminap-form-actions"
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <button
              className="adminap-btn-primary"
              disabled={creating}
              aria-disabled={creating}
            >
              {creating ? "Creazione…" : "Crea post"}
            </button>
          </div>
        </form>

        {/* Elenco post */}
        <div className="adminap-card">
          <h3 className="adminap-card-title">Elenco post</h3>
          {experienceItems.length === 0 ? (
            <p className="adminap-muted">
              Nessun post. Aggiungi il primo dal modulo sopra.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titolo</th>
                    <th>Stato</th>
                    <th>Ordine</th>
                    <th>Aggiornato</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {experienceItems.map((it) => (
                    <tr key={it._id}>
                      <td>{it.title || "—"}</td>
                      <td>{it.order ?? 0}</td>
                      <td>
                        {it.updatedAt
                          ? new Date(it.updatedAt).toLocaleString("it-IT")
                          : "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="actions">
                          <Link
                            href={`/admin/dynamic-parts/${it._id}`}
                            className="adminap-btn-ghost"
                          >
                            Modifica
                          </Link>
                          <button
                            type="button"
                            className="adminap-btn-ghost"
                            onClick={() => deletePost(it._id)}
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* لینک سریع به ویوی عمومی */}
        <div className="adminap-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="adminap-muted">
              Vuoi vedere la sezione sul sito?
            </span>
            <Link href="/" className="adminap-btn-ghost">
              Vai alla Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
