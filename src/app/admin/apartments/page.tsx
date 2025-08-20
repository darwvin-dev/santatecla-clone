"use client";

import { Apartment } from "@/types/Apartment";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function AdminApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApartments() {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/apartments", { withCredentials: false });
        setApartments(data);
      } catch (e: any) {
        setError(e?.message || "Errore di caricamento.");
      } finally {
        setLoading(false);
      }
    }
    fetchApartments();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apartments;
    return apartments.filter((a) =>
      [
        a.title,
        a.address,
        String(a.guests ?? ""),
        String(a.beds ?? ""),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [apartments, query]);

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      setDeleting(true);
      await fetch(`/api/apartments/${selectedId}`, { method: "DELETE" });
      setApartments((prev) => prev.filter((apt) => apt.title !== selectedId));
      setShowModal(false);
      setSelectedId(null);
    } catch (e: any) {
      alert(e?.message || "Errore nella cancellazione.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Lista Appartamenti
        </h2>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="search"
              placeholder="Cerca per titolo, indirizzo…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 h-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="m21 21-4.3-4.3m0-6.4a6.1 6.1 0 1 1-12.2 0 6.1 6.1 0 0 1 12.2 0Z" />
            </svg>
          </div>

          <Link
            href="/admin/apartments/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
          >
            + Aggiungi Nuovo
          </Link>
        </div>
      </div>

      {/* Card/Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
        {loading ? (
          <div className="p-8">
            <div className="mx-auto h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 space-y-3">
              <div className="h-14 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-14 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-14 w-full animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100" />
            <p className="text-slate-500">Nessun appartamento trovato.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold">Titolo</th>
                  <th className="px-4 py-3 font-semibold">Ospiti</th>
                  <th className="px-4 py-3 font-semibold">Letti</th>
                  <th className="px-4 py-3 font-semibold">Indirizzo</th>
                  <th className="px-4 py-3 font-semibold">Immagine</th>
                  <th className="px-4 py-3 font-semibold text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((apt) => (
                  <tr key={apt.title} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{apt.title}</td>
                    <td className="px-4 py-3 text-slate-700">{apt.guests}</td>
                    <td className="px-4 py-3 text-slate-700">{apt.beds}</td>
                    <td className="px-4 py-3 text-slate-700">{apt.address}</td>
                    <td className="px-4 py-3">
                      {apt.image ? (
                        <img
                          src={apt.image}
                          alt={apt.title}
                          className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/apartments/${apt.title}`}
                          className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Modifica
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedId(apt.title);
                            setShowModal(true);
                          }}
                          className="inline-flex h-9 items-center rounded-lg bg-rose-500 px-3 text-xs font-semibold text-white shadow hover:bg-rose-600"
                        >
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards (اختیاری اگر بخوای خیلی موبایلی‌تر شه، می‌تونیم table رو حذف و فقط کارت بسازیم) */}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Conferma Eliminazione
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Sei sicuro di voler eliminare questo appartamento?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Annulla
              </button>
              <button
                className="inline-flex h-10 items-center rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white shadow hover:bg-rose-600 disabled:opacity-60"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Eliminazione…" : "Elimina"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
