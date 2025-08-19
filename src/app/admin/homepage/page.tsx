// /app/admin/home/dynamic-parts/page.tsx
"use client";

import { useEffect, useState } from "react";
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

export default function DynamicPartsHomePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/dynamic-parts?page=Home", { cache: "no-store" });
    const data = await res.json();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Sezioni Dinamiche — Home</h1>
        <Link href="/admin/dynamic-parts/new" className="btn btn-success">
          + Nuovo
        </Link>
      </div>

      {loading ? (
        <div>Caricamento…</div>
      ) : rows.length === 0 ? (
        <div className="alert alert-info">
          Nessuna sezione registrata per <strong>Home</strong>. Clicca su <em>Nuovo</em> per crearne una.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Ordine</th>
                <th>Chiave</th>
                <th>Titolo</th>
                <th>Secondo titolo</th>
                <th>Stato</th>
                <th>Aggiornato</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.order ?? 0}</td>
                  <td><code>{r.key}</code></td>
                  <td>{r.title || "—"}</td>
                  <td>{r.secondTitle || "—"}</td>
                  <td>{r.published ? "Pubblicato" : "Bozza"}</td>
                  <td>{new Date(r.updatedAt).toLocaleString()}</td>
                  <td className="text-end">
                    <Link href={`/admin/dynamic-parts/${r._id}`} className="btn btn-sm btn-primary">
                      Modifica
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
