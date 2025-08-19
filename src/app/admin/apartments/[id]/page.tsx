"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import "../admin-apartments.css";

/* ------------ Types ------------ */
type Rules = { checkInFrom: string; checkInTo: string; checkOutBy: string };
type Cancellation = { policy: "free_until_5_days" | "flexible" | "strict"; note?: string };
type Amenity =
  | "macchina_caffe" | "aria_condizionata" | "bollitore" | "tostapane" | "lavastoviglie"
  | "self_check_in" | "tv" | "lavatrice" | "set_di_cortesia" | "microonde" | "biancheria"
  | "culla_su_richiesta" | "wifi" | "parcheggio_esterno" | "animali_ammessi" | "asciugacapelli" | "balcone";

type Feature = { key: Amenity; label: string; icon: string };

const FEATURES: Feature[] = [
  { key: "macchina_caffe", label: "Macchina del caffè", icon: "/features-icon/coffee-machine.svg" },
  { key: "aria_condizionata", label: "Aria condizionata", icon: "/features-icon/air-conditioning.svg" },
  { key: "bollitore", label: "Bollitore", icon: "/features-icon/kettle.svg" },
  { key: "tostapane", label: "Tostapane", icon: "/features-icon/toaster.svg" },
  { key: "lavastoviglie", label: "Lavastoviglie", icon: "/features-icon/dishwasher.svg" },
  { key: "self_check_in", label: "Self Check-in", icon: "/features-icon/self-check-in.svg" },
  { key: "tv", label: "TV", icon: "/features-icon/tv.svg" },
  { key: "lavatrice", label: "Lavatrice", icon: "/features-icon/lavatrice.svg" },
  { key: "set_di_cortesia", label: "Set di cortesia", icon: "/features-icon/set-di-cortesia.svg" },
  { key: "microonde", label: "Microonde", icon: "/features-icon/microonde.svg" },
  { key: "biancheria", label: "Biancheria", icon: "/features-icon/biancheria.svg" },
  { key: "culla_su_richiesta", label: "Culla su richiesta", icon: "/features-icon/culla-su-richiesta.svg" },
  { key: "wifi", label: "WiFi", icon: "/features-icon/wifi.svg" },
  { key: "parcheggio_esterno", label: "Parcheggio esterno", icon: "/features-icon/parcheggio-esterno.svg" },
  { key: "animali_ammessi", label: "Animali ammessi", icon: "/features-icon/animali-ammessi.svg" },
  { key: "asciugacapelli", label: "Asciugacapelli", icon: "/features-icon/asciugacapelli.svg" },
  { key: "balcone", label: "Balcone", icon: "/features-icon/balcone.svg" },
];

const MapPicker = dynamic(() => import("../../../components/admin/MapPicker"), {
  ssr: false,
  loading: () => <div className="adminap-map-skeleton">Caricamento mappa…</div>,
});

function FeatureCard({
  feature, selected, onToggle,
}: { feature: Feature; selected: boolean; onToggle: (key: Amenity) => void; }) {
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
        <img src={feature.icon} alt="" aria-hidden="true" width={28} height={28} />
      </span>
      <span className="adminap-feature-label">{feature.label}</span>
    </button>
  );
}

/* ------------ Page (Edit) ------------ */
export default function EditApartmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // base form
  const [form, setForm] = useState({
    id: "",
    title: "",
    guests: "1",
    sizeSqm: "",
    floor: "",
    bathrooms: "1",
    address: "",
    addressDetail: "",
    description: "",
    details: "",
    lat: "",
    lng: "",
  });

  // features
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [rules, setRules] = useState<Rules>({ checkInFrom: "15:00", checkInTo: "19:00", checkOutBy: "10:00" });
  const [cancellation, setCancellation] = useState<Cancellation>({ policy: "free_until_5_days", note: "" });

  // images state
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [existingPlan, setExistingPlan] = useState<string | null>(null);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryNew, setGalleryNew] = useState<File[]>([]);
  const [planImage, setPlanImage] = useState<File | null>(null);
  const [removePlan, setRemovePlan] = useState(false);

  const [featureQuery, setFeatureQuery] = useState("");
  const filteredFeatures = useMemo(() => {
    const q = featureQuery.trim().toLowerCase();
    if (!q) return FEATURES;
    return FEATURES.filter((f) => f.label.toLowerCase().includes(q));
  }, [featureQuery]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------ Load existing ------------ */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/apartments/${id}`);
        const a = res.data;

        setForm({
          id: a._id,
          title: a.title ?? "",
          guests: String(a.guests ?? "1"),
          sizeSqm: String(a.sizeSqm ?? a.size ?? ""),
          floor: a.floor ?? "",
          bathrooms: String(a.bathrooms ?? "1"),
          address: a.address ?? "",
          addressDetail: a.addressDetail ?? "",
          description: a.description ?? "",
          details: a.details ?? "",
          lat: a.location?.lat ? String(a.location.lat) : "",
          lng: a.location?.lng ? String(a.location.lng) : "",
        });

        setAmenities(a.amenities ?? []);
        setRules(a.rules ?? { checkInFrom: "15:00", checkInTo: "19:00", checkOutBy: "10:00" });
        setCancellation(a.cancellation ?? { policy: "free_until_5_days", note: "" });

        setExistingCover(a.image ?? null);
        setExistingGallery(a.gallery ?? []);
        setExistingPlan(a.plan ?? null);
      } catch (e: any) {
        setError(e?.response?.data?.error ?? "Errore nel caricamento");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ------------ Handlers ------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleAmenityToggle = (key: Amenity) =>
    setAmenities((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]));

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCoverImage(e.target.files[0]);
  };
  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPlanImage(e.target.files[0]);
      setRemovePlan(false);
    }
  };
  const handleGalleryNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGalleryNew((g) => [...g, ...files]); // بی‌نهایت (سمت سرور هندل کن)
  };
  const removeExistingGalleryItem = (url: string) =>
    setExistingGallery((arr) => arr.filter((x) => x !== url));
  const removeNewGalleryIndex = (idx: number) =>
    setGalleryNew((g) => g.filter((_, i) => i !== idx));

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.guests &&
      form.bathrooms &&
      form.sizeSqm &&
      form.address.trim() &&
      form.description.trim()
    );
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      alert("Per favore compila i campi obbligatori.");
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
    fd.append("addressDetail", form.addressDetail);
    fd.append("description", form.description);
    fd.append("details", form.details);

    if (form.lat && form.lng) {
      fd.append("lat", form.lat);
      fd.append("lng", form.lng);
    }

    fd.append("amenities", JSON.stringify(amenities));
    fd.append("rules", JSON.stringify(rules));
    fd.append("cancellation", JSON.stringify(cancellation));

    // cover (optional replace)
    if (coverImage) fd.append("image", coverImage);

    // gallery: keep + new
    fd.append("keepGallery", JSON.stringify(existingGallery));
    galleryNew.forEach((file) => fd.append("galleryNew[]", file));

    // plan: remove or replace
    if (removePlan) fd.append("removePlan", "true");
    if (planImage) fd.append("plan", planImage);

    try {
      const res = await axios.post(`/api/apartments/${form.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        router.push("/admin/apartments");
      } else {
        alert("Errore nell’aggiornamento");
      }
    } catch (err: any) {
      console.error(err);
      alert("Errore nell’aggiornamento: " + (err?.response?.data?.error ?? "Sconosciuto"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------ UI ------------ */
  if (loading) {
    return (
      <div className="adminap-page">
        <div className="adminap-card"><p className="adminap-muted">Caricamento in corso…</p></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="adminap-page">
        <div className="adminap-card"><p style={{ color: "tomato" }}>{error}</p></div>
      </div>
    );
  }

  return (
    <div className="adminap-page">
      <h2 className="adminap-title">Modifica Appartamento</h2>

      <form onSubmit={handleSubmit} className="adminap-form" encType="multipart/form-data">
        {/* Info principali */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Informazioni principali</h3>
          <div className="adminap-grid-2">
            <div className="adminap-field">
              <label className="adminap-label">Titolo *</label>
              <input className="adminap-input" name="title" required placeholder="Es. CityLife | Via Emanuele Filiberto 14" value={form.title} onChange={handleChange} />
            </div>
            <div className="adminap-grid-2">
              <div className="adminap-field">
                <label className="adminap-label">Indirizzo *</label>
                <input className="adminap-input" name="address" required placeholder="Via Emanuele Filiberto 14, Milano" value={form.address} onChange={handleChange} />
              </div>
              <div className="adminap-field">
                <label className="adminap-label">Dettaglio indirizzo</label>
                <input className="adminap-input" name="addressDetail" placeholder="Scala B, Interno 5, vicino alla farmacia" value={form.addressDetail} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="adminap-grid-3">
            <div className="adminap-field">
              <label className="adminap-label">Ospiti *</label>
              <input className="adminap-input" name="guests" type="number" min={1} required value={form.guests} onChange={handleChange} />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Bagni *</label>
              <input className="adminap-input" name="bathrooms" type="number" min={1} required value={form.bathrooms} onChange={handleChange} />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Superficie (mq) *</label>
              <input className="adminap-input" name="sizeSqm" type="number" min={1} required value={form.sizeSqm} onChange={handleChange} />
            </div>
          </div>

          <div className="adminap-grid-2">
            <div className="adminap-field">
              <label className="adminap-label">Piano</label>
              <input className="adminap-input" name="floor" placeholder="Su due piani / Piano 3 / etc." value={form.floor} onChange={handleChange} />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Descrizione breve *</label>
              <textarea className="adminap-textarea" name="description" required placeholder="Descrizione dell’alloggio…" rows={5} value={form.description} onChange={handleChange} />
            </div>
          </div>

          <div className="adminap-field">
            <label className="adminap-label">Dettagli aggiuntivi</label>
            <textarea className="adminap-textarea" name="details" placeholder="Ulteriori informazioni, dotazioni di pregio, note sul quartiere, ecc." rows={5} value={form.details} onChange={handleChange} />
          </div>
        </section>

        {/* Immagini */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Immagini</h3>

          <div className="adminap-grid-3">
            {/* Cover */}
            <div className="adminap-field">
              <label className="adminap-label">Immagine principale</label>
              {existingCover && !coverImage && (
                <div className="adminap-image-preview" style={{ marginBottom: 10 }}>
                  <img src={existingCover} alt="Cover attuale" />
                </div>
              )}
              <input className="adminap-input-file" type="file" accept="image/*" onChange={handleCoverChange} />
              {coverImage && (
                <div className="adminap-image-preview">
                  <img src={URL.createObjectURL(coverImage)} alt="Nuova cover" />
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="adminap-field">
              <label className="adminap-label">Galleria</label>

              {existingGallery.length > 0 && (
                <>
                  <p className="adminap-muted" style={{ marginTop: 0 }}>Immagini esistenti (clic “Rimuovi” per eliminarle):</p>
                  <div className="adminap-gallery-grid" style={{ marginBottom: 12 }}>
                    {existingGallery.map((url) => (
                      <figure key={url} className="adminap-gallery-item">
                        <img src={url} alt="Esistente" />
                        <button type="button" className="adminap-btn-remove" onClick={() => removeExistingGalleryItem(url)}>Rimuovi</button>
                      </figure>
                    ))}
                  </div>
                </>
              )}

              <label className="adminap-label">Aggiungi nuove immagini</label>
              <input className="adminap-input-file" type="file" accept="image/*" multiple onChange={handleGalleryNewChange} />
              {galleryNew.length > 0 && (
                <div className="adminap-gallery-grid">
                  {galleryNew.map((f, i) => (
                    <figure key={i} className="adminap-gallery-item">
                      <img src={URL.createObjectURL(f)} alt={`Nuova ${i + 1}`} />
                      <button type="button" className="adminap-btn-remove" onClick={() => removeNewGalleryIndex(i)}>Rimuovi</button>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            {/* Plan */}
            <div className="adminap-field">
              <label className="adminap-label">Planimetria (opzionale)</label>
              {existingPlan && !planImage && !removePlan && (
                <div className="adminap-image-preview" style={{ marginBottom: 10 }}>
                  <img src={existingPlan} alt="Planimetria attuale" />
                </div>
              )}
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <input id="removePlan" type="checkbox" checked={removePlan} onChange={(e) => { setRemovePlan(e.target.checked); if (e.target.checked) setPlanImage(null); }} />
                <label htmlFor="removePlan">Rimuovi planimetria</label>
              </div>
              {!removePlan && (
                <>
                  <input className="adminap-input-file" type="file" accept="image/*" onChange={handlePlanChange} />
                  {planImage && (
                    <div className="adminap-image-preview">
                      <img src={URL.createObjectURL(planImage)} alt="Nuova planimetria" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Servizi & Dotazioni */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Servizi &amp; Dotazioni</h3>
          <div className="adminap-features-toolbar">
            <input className="adminap-input-search" type="search" placeholder="Cerca dotazioni…" value={featureQuery} onChange={(e) => setFeatureQuery(e.target.value)} />
            <div className="adminap-features-actions">
              <button type="button" className="adminap-btn-ghost" onClick={() => setAmenities(FEATURES.map((f) => f.key))}>Seleziona tutto</button>
              <button type="button" className="adminap-btn-ghost" onClick={() => setAmenities([])}>Deseleziona</button>
            </div>
          </div>
          <div className="adminap-features-grid">
            {filteredFeatures.map((f) => (
              <FeatureCard key={f.key} feature={f} selected={amenities.includes(f.key)} onToggle={handleAmenityToggle} />
            ))}
            {filteredFeatures.length === 0 && <p className="adminap-features-empty adminap-col-span">Nessun risultato.</p>}
          </div>
        </section>

        {/* Posizione */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Posizione</h3>
          <p className="adminap-muted">Imposta la posizione sulla mappa o inserisci lat/lng manualmente.</p>
          <div className="adminap-grid-2">
            <div className="adminap-map-wrap">
              <MapPicker
                initialAddress={form.address}
                onPick={(lat: number, lng: number) => setForm((f) => ({ ...f, lat: String(lat), lng: String(lng) }))}
              />
            </div>
            <div className="adminap-grid-2">
              <div className="adminap-field">
                <label className="adminap-label">Latitudine</label>
                <input className="adminap-input" name="lat" value={form.lat} onChange={handleChange} placeholder="45.478…" />
              </div>
              <div className="adminap-field">
                <label className="adminap-label">Longitudine</label>
                <input className="adminap-input" name="lng" value={form.lng} onChange={handleChange} placeholder="9.156…" />
              </div>
            </div>
          </div>
        </section>

        {/* Regole & Cancellazione */}
        <section className="adminap-card">
          <h3 className="adminap-card-title">Regole della casa</h3>
          <div className="adminap-grid-3">
            <div className="adminap-field">
              <label className="adminap-label">Check-in (da)</label>
              <input className="adminap-input" type="time" value={rules.checkInFrom} onChange={(e) => setRules((r) => ({ ...r, checkInFrom: e.target.value }))} />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Check-in (fino a)</label>
              <input className="adminap-input" type="time" value={rules.checkInTo} onChange={(e) => setRules((r) => ({ ...r, checkInTo: e.target.value }))} />
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Check-out entro</label>
              <input className="adminap-input" type="time" value={rules.checkOutBy} onChange={(e) => setRules((r) => ({ ...r, checkOutBy: e.target.value }))} />
            </div>
          </div>
        </section>

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
                    note: e.target.value === "free_until_5_days" ? "Cancellazione gratuita fino a 5 giorni prima dell’arrivo" : c.note,
                  }))
                }
              >
                <option value="free_until_5_days">Gratuita fino a 5 giorni prima</option>
                <option value="flexible">Flessibile</option>
                <option value="strict">Rigida</option>
              </select>
            </div>
            <div className="adminap-field">
              <label className="adminap-label">Nota (opzionale)</label>
              <input className="adminap-input" placeholder="Dettagli aggiuntivi sulla cancellazione" value={cancellation.note ?? ""} onChange={(e) => setCancellation((c) => ({ ...c, note: e.target.value }))} />
            </div>
          </div>
        </section>

        <div className="adminap-form-actions">
          <button type="submit" className="adminap-btn-primary" disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? "Salvataggio in corso…" : "Aggiorna"}
          </button>
        </div>
      </form>
    </div>
  );
}
