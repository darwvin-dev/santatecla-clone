"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../admin-apartments.css";
import axios from "axios";

export default function EditApartmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchApartment() {
      const res = await fetch(`/api/apartments/${id}`);
      const data = await res.json();
      setForm(data);
    }
    fetchApartment();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await axios.post(`/api/apartments/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 200) {
      router.push("/admin/apartments");
    } else {
      alert("Errore nel salvataggio");
    }
  };

  if (!form) return <p>Caricamento...</p>;

  return (
    <div className="admin-form-page">
      <h2>Modifica Appartamento</h2>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
        encType="multipart/form-data"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Titolo"
        />
        <input
          name="guests"
          type="number"
          value={form.guests}
          onChange={handleChange}
          placeholder="Ospiti"
        />
        <input
          name="beds"
          type="number"
          value={form.beds}
          onChange={handleChange}
          placeholder="Letti"
        />
        <input
          name="size"
          value={form.size}
          onChange={handleChange}
          placeholder="Superficie"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Indirizzo"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descrizione"
        ></textarea>

        <button type="submit" className="btn-primary">
          Aggiorna
        </button>
      </form>
    </div>
  );
}
