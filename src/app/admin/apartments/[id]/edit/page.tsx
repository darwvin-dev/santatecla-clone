"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditApartmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function fetchApartment() {
      const res = await fetch(`/api/apartments/${id}`);
      const data = await res.json();
      setForm(data);
    }
    fetchApartment();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/apartments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/apartments");
  };

  if (!form) return <p>Caricamento...</p>;

  return (
    <div className="admin-form-page">
      <h2>Modifica Appartamento</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input name="title" value={form.title} onChange={handleChange} />
        <input name="guests" type="number" value={form.guests} onChange={handleChange} />
        <input name="beds" type="number" value={form.beds} onChange={handleChange} />
        <input name="size" value={form.size} onChange={handleChange} />
        <input name="address" value={form.address} onChange={handleChange} />
        <input name="image" value={form.image} onChange={handleChange} />
        <textarea name="description" value={form.description} onChange={handleChange}></textarea>
        <button type="submit" className="btn-primary">Aggiorna</button>
      </form>
    </div>
  );
}
