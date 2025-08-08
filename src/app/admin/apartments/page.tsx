"use client";

import { Apartment } from "@/types/Apartment";
import { useEffect, useState } from "react";
import "./admin-apartments.css";

export default function AdminApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApartments() {
      const res = await fetch("/api/apartments");
      const data = await res.json();
      setApartments(data);
    }

    fetchApartments();
  }, []);

  const confirmDelete = async () => {
    if (!selectedId) return;

    await fetch(`/api/apartments/${selectedId}`, { method: "DELETE" });
    setApartments((prev) => prev.filter((apt) => apt._id !== selectedId));
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="admin-apartments-page">
      <div className="header">
        <h2>Lista Appartamenti</h2>
        <a href="/admin/apartments/new" className="btn-primary">
          + Aggiungi Nuovo
        </a>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titolo</th>
              <th>Ospiti</th>
              <th>Letti</th>
              <th>Indirizzo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => (
              <tr key={apt._id}>
                <td>{apt.title}</td>
                <td>{apt.guests}</td>
                <td>{apt.beds}</td>
                <td>{apt.address}</td>
                <td>
                  <div className="actions">
                    <a href={`/admin/apartments/${apt._id}/edit`} className="btn-outline">
                      Modifica
                    </a>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        setSelectedId(apt._id);
                        setShowModal(true);
                      }}
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {apartments.length === 0 && (
          <p className="no-data">Nessun appartamento trovato.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Conferma Eliminazione</h3>
            <p>Sei sicuro di voler eliminare questo appartamento?</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowModal(false)}>
                Annulla
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
