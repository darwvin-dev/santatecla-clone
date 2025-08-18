"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import "../admin-apartments.css";

type Rules = {
  checkInFrom: string;
  checkInTo: string;
  checkOutBy: string;
};

type Cancellation = {
  policy: "free_until_5_days" | "flexible" | "strict";
  note?: string;
};

type Amenity =
  | "macchina_caffe"
  | "aria_condizionata"
  | "bollitore"
  | "tostapane"
  | "lavastoviglie"
  | "self_check_in"
  | "tv"
  | "lavatrice"
  | "set_di_cortesia"
  | "microonde"
  | "biancheria"
  | "culla_su_richiesta"
  | "wifi"
  | "parcheggio_esterno"
  | "animali_ammessi"
  | "asciugacapelli"
  | "balcone";

type Feature = {
  key: Amenity;
  label: string;
  icon: string;
};

const FEATURES: Feature[] = [
  {
    key: "macchina_caffe",
    label: "Macchina del caffè",
    icon: "/features-icon/coffee-machine.svg",
  },
  {
    key: "aria_condizionata",
    label: "Aria condizionata",
    icon: "/features-icon/air-conditioning.svg",
  },
  { key: "bollitore", label: "Bollitore", icon: "/features-icon/kettle.svg" },
  { key: "tostapane", label: "Tostapane", icon: "/features-icon/toaster.svg" },
  {
    key: "lavastoviglie",
    label: "Lavastoviglie",
    icon: "/features-icon/dishwasher.svg",
  },
  {
    key: "self_check_in",
    label: "Self Check-in",
    icon: "/features-icon/self-check-in.svg",
  },
  { key: "tv", label: "TV", icon: "/features-icon/tv.svg" },
  {
    key: "lavatrice",
    label: "Lavatrice",
    icon: "/features-icon/lavatrice.svg",
  },
  {
    key: "set_di_cortesia",
    label: "Set di cortesia",
    icon: "/features-icon/set-di-cortesia.svg",
  },
  {
    key: "microonde",
    label: "Microonde",
    icon: "/features-icon/microonde.svg",
  },
  {
    key: "biancheria",
    label: "Biancheria",
    icon: "/features-icon/biancheria.svg",
  },
  {
    key: "culla_su_richiesta",
    label: "Culla su richiesta",
    icon: "/features-icon/culla-su-richiesta.svg",
  },
  { key: "wifi", label: "WiFi", icon: "/features-icon/wifi.svg" },
  {
    key: "parcheggio_esterno",
    label: "Parcheggio esterno",
    icon: "/features-icon/parcheggio-esterno.svg",
  },
  {
    key: "animali_ammessi",
    label: "Animali ammessi",
    icon: "/features-icon/animali-ammessi.svg",
  },
  {
    key: "asciugacapelli",
    label: "Asciugacapelli",
    icon: "/features-icon/asciugacapelli.svg",
  },
  { key: "balcone", label: "Balcone", icon: "/features-icon/balcone.svg" },
];

const MapPicker = dynamic(() => import("../../../components/admin/MapPicker"), {
  ssr: false,
  loading: () => <div className="adminap-map-skeleton">Caricamento mappa…</div>,
});

function FeatureCard({
  feature,
  selected,
  onToggle,
}: {
  feature: Feature;
  selected: boolean;
  onToggle: (key: Amenity) => void;
}) {
  return (
    <button
      type="button"
      className={`adminap-feature-card ${selected ? "is-selected" : ""}`}
      onClick={() => onToggle(feature.key)}
      role="switch"
      aria-checked={selected}
      title={feature.label}
    >
      <span className="adminap-feature-icon">
        <img
          src={feature.icon}
          alt=""
          aria-hidden="true"
          width={28}
          height={28}
        />
      </span>
      <span className="adminap-feature-label">{feature.label}</span>
    </button>
  );
}

/* ---------------- Page ---------------- */

export default function NewApartmentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    guests: "5",
    sizeSqm: "95",
    floor: "Su due piani",
    bathrooms: "2",
    address: "",
    addressDetail: "",
    description: "",
    details: "",
    lat: "",
    lng: "",
  });

  const [amenities, setAmenities] = useState<Amenity[]>([
    "wifi",
    "aria_condizionata",
    "macchina_caffe",
    "tv",
  ]);

  const [rules, setRules] = useState<Rules>({
    checkInFrom: "15:00",
    checkInTo: "19:00",
    checkOutBy: "10:00",
  });

  const [cancellation, setCancellation] = useState<Cancellation>({
    policy: "free_until_5_days",
    note: "Cancellazione gratuita fino a 5 giorni prima dell’arrivo",
  });

  // فایل‌ها
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [planImage, setPlanImage] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // جست‌وجوی ویژگی‌ها
  const [featureQuery, setFeatureQuery] = useState("");

  const filteredFeatures = useMemo(() => {
    const q = featureQuery.trim().toLowerCase();
    if (!q) return FEATURES;
    return FEATURES.filter((f) => f.label.toLowerCase().includes(q));
  }, [featureQuery]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAmenityToggle = (key: Amenity) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCoverImage(e.target.files[0]);
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPlanImage(e.target.files[0]);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const next = [...gallery, ...files].slice(0, 12); // حداکثر ۱۲
    setGallery(next);
  };

  const removeGalleryIndex = (idx: number) => {
    setGallery((g) => g.filter((_, i) => i !== idx));
  };

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.guests &&
      form.bathrooms &&
      form.sizeSqm &&
      form.address.trim() &&
      form.description.trim() &&
      coverImage
    );
  }, [form, coverImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      alert(
        "Per favore compila i campi obbligatori e seleziona l’immagine principale."
      );
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("guests", form.guests);
    fd.append("bathrooms", form.bathrooms);
    fd.append("sizeSqm", form.sizeSqm);
    fd.append("floor", form.floor);
    fd.append("address", form.address);
    fd.append("description", form.description);
    fd.append("details", form.details);

    // location
    if (form.lat && form.lng) {
      fd.append("lat", form.lat);
      fd.append("lng", form.lng);
    }

    // amenities / rules / cancellation
    fd.append("amenities", JSON.stringify(amenities));
    fd.append("rules", JSON.stringify(rules));
    fd.append("cancellation", JSON.stringify(cancellation));

    // immagini
    if (coverImage) fd.append("image", coverImage);
    gallery.forEach((file) => fd.append("gallery[]", file));
    if (planImage) fd.append("plan", planImage); // opzionale

    try {
      const res = await axios.post("/api/apartments", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        router.push("/admin/apartments");
      } else {
        alert("Errore nel salvataggio");
      }
    } catch (error: any) {
      console.error(error);
      alert(
        "Errore nel salvataggio: " +
          (error?.response?.data?.error ?? "Sconosciuto")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="adminap-page">
      <h2 className="adminap-title">Nuovo Appartamento</h2>

      <form
        onSubmit={handleSubmit}
        className="adminap-form"
        encType="multipart/form-data"
      >
        {/* Info principali */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Informazioni principali</h3>
          <div className="adminap-grid-2">
            <div className="adminap-field">
              <label className="adminap-label">Titolo *</label>
              <input
                className="adminap-input"
                name="title"
                placeholder="Es. CityLife | Via Emanuele Filiberto 14"
                required
                value={form.title}
                onChange={handleChange}
              />
            </div>
            <div className="adminap-grid-2">
              <div className="adminap-field">
                <label className="adminap-label">Indirizzo *</label>
                <input
                  className="adminap-input"
                  name="address"
                  placeholder="Via Emanuele Filiberto 14, Milano"
                  required
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="adminap-field">
                <label className="adminap-label">Dettaglio indirizzo</label>
                <input
                  className="adminap-input"
                  name="addressDetail"
                  placeholder="Scala B, Interno 5, vicino alla farmacia"
                  value={form.addressDetail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="adminap-grid-3">
            <div className="adminap-field">
              <label className="adminap-label">Ospiti *</label>
              <input
                className="adminap-input"
                name="guests"
                type="number"
                min={1}
                required
                value={form.guests}
                onChange={handleChange}
              />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Bagni *</label>
              <input
                className="adminap-input"
                name="bathrooms"
                type="number"
                min={1}
                required
                value={form.bathrooms}
                onChange={handleChange}
              />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Superficie (mq) *</label>
              <input
                className="adminap-input"
                name="sizeSqm"
                type="number"
                min={1}
                required
                value={form.sizeSqm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="adminap-grid-2">
            <div className="adminap-field">
              <label className="adminap-label">Piano</label>
              <input
                className="adminap-input"
                name="floor"
                placeholder="Su due piani / Piano 3 / etc."
                value={form.floor}
                onChange={handleChange}
              />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Descrizione breve *</label>
              <textarea
                className="adminap-textarea"
                name="description"
                placeholder="Descrizione dell’alloggio…"
                required
                value={form.description}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </div>

          <div className="adminap-field">
            <label className="adminap-label">Dettagli aggiuntivi</label>
            <textarea
              className="adminap-textarea"
              name="details"
              placeholder="Ulteriori informazioni, dotazioni di pregio, note sul quartiere, ecc."
              value={form.details}
              onChange={handleChange}
              rows={5}
            />
          </div>
        </section>

        {/* Media */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Immagini</h3>

          <div className="adminap-grid-3">
            <div className="adminap-field">
              <label className="adminap-label">Immagine principale *</label>
              <input
                className="adminap-input-file"
                type="file"
                accept="image/*"
                required
                onChange={handleCoverChange}
              />
              {coverImage && (
                <div className="adminap-image-preview">
                  <img src={URL.createObjectURL(coverImage)} alt="Cover" />
                </div>
              )}
            </div>

            <div className="adminap-field">
              <label className="adminap-label">Galleria (fino a 12)</label>
              <input
                className="adminap-input-file"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
              />
              {gallery.length > 0 && (
                <div className="adminap-gallery-grid">
                  {gallery.map((f, i) => (
                    <figure key={i} className="adminap-gallery-item">
                      <img
                        src={URL.createObjectURL(f)}
                        alt={`Gallery ${i + 1}`}
                      />
                      <button
                        type="button"
                        className="adminap-btn-remove"
                        onClick={() => removeGalleryIndex(i)}
                        aria-label="Rimuovi"
                      >
                        Rimuovi
                      </button>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <div className="adminap-field">
              <label className="adminap-label">Planimetria (opzionale)</label>
              <input
                className="adminap-input-file"
                type="file"
                accept="image/*"
                onChange={handlePlanChange}
              />
              {planImage && (
                <div className="adminap-image-preview">
                  <img src={URL.createObjectURL(planImage)} alt="Planimetria" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Servizi & Dotazioni (آیکونی + جست‌وجو) */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Servizi &amp; Dotazioni</h3>

          <div className="adminap-features-toolbar">
            <input
              className="adminap-input-search"
              type="search"
              placeholder="Cerca dotazioni…"
              value={featureQuery}
              onChange={(e) => setFeatureQuery(e.target.value)}
              aria-label="Cerca dotazioni"
            />
            <div className="adminap-features-actions">
              <button
                type="button"
                className="adminap-btn-ghost"
                onClick={() => setAmenities(FEATURES.map((f) => f.key))}
              >
                Seleziona tutto
              </button>
              <button
                type="button"
                className="adminap-btn-ghost"
                onClick={() => setAmenities([])}
              >
                Deseleziona
              </button>
            </div>
          </div>

          <div className="adminap-features-grid">
            {filteredFeatures.map((f) => (
              <FeatureCard
                key={f.key}
                feature={f}
                selected={amenities.includes(f.key)}
                onToggle={handleAmenityToggle}
              />
            ))}
            {filteredFeatures.length === 0 && (
              <p className="adminap-features-empty adminap-col-span">
                Nessun risultato.
              </p>
            )}
          </div>
        </section>

        {/* Mappa / posizione */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Posizione</h3>
          <p className="adminap-muted">
            Imposta la posizione sulla mappa o inserisci lat/lng manualmente.
          </p>
          <div className="adminap-grid-2">
            <div className="adminap-map-wrap">
              <MapPicker
                initialAddress={form.address}
                onPick={(lat: number, lng: number) => {
                  setForm((f) => ({
                    ...f,
                    lat: String(lat),
                    lng: String(lng),
                  }));
                }}
              />
            </div>
            <div className="adminap-grid-2">
              <div className="adminap-field">
                <label className="adminap-label">Latitudine</label>
                <input
                  className="adminap-input"
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  placeholder="45.478…"
                />
              </div>
              <div className="adminap-field">
                <label className="adminap-label">Longitudine</label>
                <input
                  className="adminap-input"
                  name="lng"
                  value={form.lng}
                  onChange={handleChange}
                  placeholder="9.156…"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Regole della casa */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Regole della casa</h3>
          <div className="adminap-grid-3">
            <div className="adminap-field">
              <label className="adminap-label">Check-in (da)</label>
              <input
                className="adminap-input"
                type="time"
                value={rules.checkInFrom}
                onChange={(e) =>
                  setRules((r) => ({ ...r, checkInFrom: e.target.value }))
                }
              />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Check-in (fino a)</label>
              <input
                className="adminap-input"
                type="time"
                value={rules.checkInTo}
                onChange={(e) =>
                  setRules((r) => ({ ...r, checkInTo: e.target.value }))
                }
              />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Check-out entro</label>
              <input
                className="adminap-input"
                type="time"
                value={rules.checkOutBy}
                onChange={(e) =>
                  setRules((r) => ({ ...r, checkOutBy: e.target.value }))
                }
              />
            </div>
          </div>
        </section>

        {/* Termini di cancellazione */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Termini di cancellazione</h3>
          <div className="adminap-grid-2">
            <div className="adminap-field">
              <label className="adminap-label">Politica</label>
              <select
                className="adminap-select"
                value={cancellation.policy}
                onChange={(e) =>
                  setCancellation((c) => ({
                    ...c,
                    policy: e.target.value as Cancellation["policy"],
                    note:
                      e.target.value === "free_until_5_days"
                        ? "Cancellazione gratuita fino a 5 giorni prima dell’arrivo"
                        : c.note,
                  }))
                }
              >
                <option value="free_until_5_days">
                  Gratuita fino a 5 giorni prima
                </option>
                <option value="flexible">Flessibile</option>
                <option value="strict">Rigida</option>
              </select>
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Nota (opzionale)</label>
              <input
                className="adminap-input"
                placeholder="Dettagli aggiuntivi sulla cancellazione"
                value={cancellation.note ?? ""}
                onChange={(e) =>
                  setCancellation((c) => ({ ...c, note: e.target.value }))
                }
              />
            </div>
          </div>
        </section>

        <div className="adminap-form-actions">
          <button
            type="submit"
            className="adminap-btn-primary"
            disabled={isSubmitting || !canSubmit}
            aria-disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? "Salvataggio in corso…" : "Salva"}
          </button>
        </div>
      </form>
    </div>
  );
}
