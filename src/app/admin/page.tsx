// /app/admin/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DynamicPart = {
  _id: string;
  key: string;
  page: string;
  title?: string;
  published?: boolean;
  updatedAt?: string;
  order?: number;
};

type Apartment = {
  _id: string;
  title: string;
  image?: string;
  address?: string;
  updatedAt?: string;
};

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
          fetch("/api/dynamic-parts?page=Home", { cache: "no-store" }),
          fetch("/api/apartments", { cache: "no-store" }),
        ]);
        if (!dpRes.ok) throw new Error("Errore nel caricamento delle sezioni Home.");
        if (!apRes.ok) throw new Error("Errore nel caricamento degli appartamenti.");
        const [dpData, apData] = await Promise.all([dpRes.json(), apRes.json()]);
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
    const published = homeParts.filter(p => p.published).length;
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

  return (
    <div className="adminap-page">
      <div className="adminap-form">
        <h1 className="adminap-title">Dashboard</h1>

        {/* اکشن‌های سریع */}
        <div className="adminap-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h3 className="adminap-card-title" style={{ marginBottom: 6 }}>Benvenuto nel pannello</h3>
            <p className="adminap-muted" style={{ margin: 0 }}>
              Gestisci velocemente la Home e gli appartamenti.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/admin/home/dynamic-parts/new" className="adminap-btn-primary">+ Nuova sezione Home</Link>
            <Link href="/admin/home/dynamic-parts" className="adminap-btn-ghost">Elenco sezioni</Link>
            <Link href="/admin/apartments" className="adminap-btn-ghost">Elenco appartamenti</Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="adminap-grid-4">
          <div className="adminap-card">
            <h4 className="adminap-card-title">Sezioni Home (totale)</h4>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{kpis.total}</div>
            <div className="adminap-muted">Somma di tutte le sezioni per la pagina Home</div>
          </div>
          <div className="adminap-card">
            <h4 className="adminap-card-title">Pubblicate</h4>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{kpis.published}</div>
            <div className="adminap-muted">Visibili sul sito</div>
          </div>
          <div className="adminap-card">
            <h4 className="adminap-card-title">Bozze</h4>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{kpis.drafts}</div>
            <div className="adminap-muted">Non ancora pubblicate</div>
          </div>
          <div className="adminap-card">
            <h4 className="adminap-card-title">Appartamenti</h4>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{kpis.apartments}</div>
            <div className="adminap-muted">Totale unità</div>
          </div>
        </div>

        {/* Ultime modifiche */}
        <div className="adminap-card">
          <h3 className="adminap-card-title">Ultime modifiche — Home</h3>

          {loading ? (
            <p className="adminap-muted">Caricamento…</p>
          ) : err ? (
            <p className="adminap-muted" style={{ color: "var(--danger)" }}>{err}</p>
          ) : recent.length === 0 ? (
            <p className="adminap-muted">Nessuna sezione trovata. Crea la prima dalla pagina "Nuova sezione".</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Chiave</th>
                    <th>Titolo</th>
                    <th>Stato</th>
                    <th>Ordine</th>
                    <th>Aggiornato</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r._id}>
                      <td>{r.key}</td>
                      <td>{r.title || "—"}</td>
                      <td>{r.published ? "Pubblicata" : "Bozza"}</td>
                      <td>{r.order ?? 0}</td>
                      <td>{r.updatedAt ? new Date(r.updatedAt).toLocaleString("it-IT") : "—"}</td>
                      <td className="text-end" style={{ textAlign: "right" }}>
                        <Link href={`/admin/dynamic-parts/${r._id}`} className="adminap-btn-ghost">Modifica</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Piccolo riepilogo appartamenti (اختیاری) */}
        <div className="adminap-card">
          <h3 className="adminap-card-title">Appartamenti (ultimi 5)</h3>
          {loading ? (
            <p className="adminap-muted">Caricamento…</p>
          ) : apartments.length === 0 ? (
            <p className="adminap-muted">Nessun appartamento trovato.</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titolo</th>
                    <th>Aggiornato</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...apartments]
                    .sort((a, b) => {
                      const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                      const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                      return tB - tA;
                    })
                    .slice(0, 5)
                    .map((a) => (
                      <tr key={a._id}>
                        <td>{a.title}</td>
                        <td>{a.updatedAt ? new Date(a.updatedAt).toLocaleString("it-IT") : "—"}</td>
                        <td style={{ textAlign: "right" }}>
                          <Link href={`/admin/apartments/${a._id}`} className="adminap-btn-ghost">Apri</Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
