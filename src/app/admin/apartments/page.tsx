"use client";

import { Apartment } from "@/types/Apartment";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

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
        const { data } = await axios.get("/api/apartments");
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
      [a.title, a.address, String(a.guests ?? ""), String(a.beds ?? "")]
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

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    const items = Array.from(apartments);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);

    // بروزرسانی orderShow بر اساس موقعیت جدید
    const updatedItems = items.map((item, idx) => ({
      ...item,
      orderShow: idx + 1,
    }));

    setApartments(updatedItems);

    try {
      await axios.put("/api/apartments/order", {
        order: updatedItems.map((a) => ({ id: a._id, orderShow: a.orderShow })),
      });
    } catch (err) {
      console.error("Errore aggiornamento ordine:", err);
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
          </div>

          <Link
            href="/admin/apartments/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
          >
            + Aggiungi Nuovo
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
        {loading ? (
          <div className="p-8 animate-pulse space-y-3">
            <div className="h-5 w-40 bg-slate-200 rounded"></div>
            <div className="h-14 w-full bg-slate-100 rounded"></div>
            <div className="h-14 w-full bg-slate-100 rounded"></div>
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="apartments">
                {(provided) => (
                  <table
                    className="min-w-full text-left text-sm"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <thead className="bg-slate-50 text-slate-600">
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3"></th>
                        <th className="px-4 py-3 font-semibold">Titolo</th>
                        <th className="px-4 py-3 font-semibold">Ospiti</th>
                        <th className="px-4 py-3 font-semibold">Letti</th>
                        <th className="px-4 py-3 font-semibold">Indirizzo</th>
                        <th className="px-4 py-3 font-semibold">Immagine</th>
                        <th className="px-4 py-3 font-semibold text-right">
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((apt, index) => (
                        <Draggable
                          key={apt._id}
                          draggableId={apt._id}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="hover:bg-slate-50/60"
                            >
                              {/* Drag handle */}
                              <td
                                {...provided.dragHandleProps}
                                className="px-4 py-3 cursor-grab"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                  role="img"
                                >
                                  <path d="M4 6h16"></path>
                                  <path d="M4 12h16"></path>
                                  <path d="M4 18h16"></path>
                                </svg>
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-900">
                                {apt.title}
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                {apt.guests}
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                {apt.beds}
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                {apt.address}
                              </td>
                              <td className="px-4 py-3">
                                {apt.image ? (
                                  <img
                                    src={apt.image}
                                    className="h-14 w-14 rounded-lg object-cover"
                                  />
                                ) : (
                                  "—"
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </DragDropContext>
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
