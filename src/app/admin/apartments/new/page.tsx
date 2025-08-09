"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../admin-apartments.css";

export default function NewApartmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    guests: "1",
    beds: "1",
    size: "",
    address: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("guests", form.guests);
    formData.append("beds", form.beds);
    formData.append("size", form.size);
    formData.append("address", form.address);
    formData.append("description", form.description);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      alert("Please select an image");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("/api/apartments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        router.push("/admin/apartments");
      } else {
        alert("Errore nel salvataggio");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Errore nel salvataggio: " + (error as any).response?.data?.error || "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-page">
      <h2>Nuovo Appartamento</h2>
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <input
          name="title"
          placeholder="Titolo"
          required
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="guests"
          type="number"
          placeholder="Ospiti"
          required
          min="1"
          value={form.guests}
          onChange={handleChange}
        />
        <input
          name="beds"
          type="number"
          placeholder="Letti"
          required
          min="1"
          value={form.beds}
          onChange={handleChange}
        />
        <input
          name="size"
          placeholder="Superficie"
          value={form.size}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Indirizzo"
          value={form.address}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Descrizione"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          onChange={handleFileChange}
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvataggio in corso..." : "Salva"}
        </button>
      </form>
    </div>
  );
}