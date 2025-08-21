"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

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
  loading: () => (
    <div className="h-[360px] w-full rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse grid place-items-center text-slate-500">
      Caricamento mappa…
    </div>
  ),
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
      onClick={() => onToggle(feature.key)}
      className={[
        "group flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
        "hover:shadow-sm hover:bg-slate-50",
        selected
          ? "border-emerald-300 ring-2 ring-emerald-200 bg-white"
          : "border-slate-200 bg-white",
      ].join(" ")}
      role="switch"
      aria-checked={selected}
      title={feature.label}
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white">
        <img src={feature.icon} alt="" width={22} height={22} />
      </span>
      <span className="text-sm font-medium text-slate-800">
        {feature.label}
      </span>
      <span
        className={[
          "ml-auto inline-flex h-5 w-9 items-center rounded-full border transition",
          selected
            ? "border-emerald-300 bg-emerald-500/90"
            : "border-slate-300 bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "h-4 w-4 rounded-full bg-white shadow transition",
            selected ? "translate-x-4" : "translate-x-1",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

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
    cin: "",
    cir: "",
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

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [planImage, setPlanImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setGallery((g) => [...g, ...files].slice(0, 12));
  };
  const removeGalleryIndex = (idx: number) =>
    setGallery((g) => g.filter((_, i) => i !== idx));

  const canSubmit = useMemo(
    () =>
      !!(
        form.title.trim() &&
        form.guests &&
        form.bathrooms &&
        form.sizeSqm &&
        form.address.trim() &&
        form.description.trim() &&
        coverImage
      ),
    [form, coverImage]
  );

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
    fd.append("cin", form.cin);
    fd.append("cir", form.cir);
    if (form.lat && form.lng) {
      fd.append("lat", form.lat);
      fd.append("lng", form.lng);
    }
    fd.append("amenities", JSON.stringify(amenities));
    fd.append("rules", JSON.stringify(rules));
    fd.append("cancellation", JSON.stringify(cancellation));
    if (coverImage) fd.append("image", coverImage);
    gallery.forEach((file) => fd.append("gallery[]", file));
    if (planImage) fd.append("plan", planImage);

    try {
      const res = await axios.post("/api/apartments", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) router.push("/admin/apartments");
      else alert("Errore nel salvataggio");
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
    <div className="min-h-[calc(100vh-60px)] bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Nuovo Appartamento
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Compila le informazioni principali, carica le immagini e definisci
            servizi e regole della casa.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Info principali */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Informazioni principali
            </h3>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Titolo *
                  </label>
                  <input
                    name="title"
                    required
                    placeholder="Es. CityLife | Via Emanuele Filiberto 14"
                    value={form.title}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Indirizzo *
                    </label>
                    <input
                      name="address"
                      required
                      placeholder="Via Emanuele Filiberto 14, Milano"
                      value={form.address}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Dettaglio indirizzo
                    </label>
                    <input
                      name="addressDetail"
                      placeholder="Scala B, Interno 5…"
                      value={form.addressDetail}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Ospiti *
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="guests"
                    required
                    value={form.guests}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Bagni *
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="bathrooms"
                    required
                    value={form.bathrooms}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Superficie (mq) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="sizeSqm"
                    required
                    value={form.sizeSqm}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    CIR
                  </label>
                  <input
                    name="cir"
                    value={form.cir}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    CIN
                  </label>
                  <input
                    name="cin"
                    required
                    value={form.cin}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Piano
                  </label>
                  <input
                    name="floor"
                    placeholder="Su due piani / Piano 3…"
                    value={form.floor}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Descrizione breve *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    placeholder="Descrizione dell’alloggio…"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Dettagli aggiuntivi
                </label>
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Ulteriori info, dotazioni di pregio, note sul quartiere, ecc."
                  value={form.details}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          </section>

          {/* Immagini */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Immagini</h3>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {/* Cover */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Immagine principale *
                </label>
                <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                  <span>Seleziona file</span>
                </label>
                {coverImage && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Galleria (fino a 12)
                </label>
                <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                  <span>Aggiungi immagini</span>
                </label>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {gallery.map((f, i) => (
                      <figure
                        key={i}
                        className="group relative overflow-hidden rounded-lg"
                      >
                        <img
                          src={URL.createObjectURL(f)}
                          alt={`Gallery ${i + 1}`}
                          className="h-28 w-full object-cover ring-1 ring-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryIndex(i)}
                          className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow group-hover:block"
                        >
                          Rimuovi
                        </button>
                      </figure>
                    ))}
                  </div>
                )}
              </div>

              {/* Plan */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Planimetria (opzionale)
                </label>
                <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePlanChange}
                  />
                  <span>Seleziona file</span>
                </label>
                {planImage && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={URL.createObjectURL(planImage)}
                      alt="Planimetria"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Servizi & Dotazioni */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Servizi &amp; Dotazioni
            </h3>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                placeholder="Cerca dotazioni…"
                value={featureQuery}
                onChange={(e) => setFeatureQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400 sm:w-80"
                aria-label="Cerca dotazioni"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAmenities(FEATURES.map((f) => f.key))}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Seleziona tutto
                </button>
                <button
                  type="button"
                  onClick={() => setAmenities([])}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Deseleziona
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFeatures.map((f) => (
                <FeatureCard
                  key={f.key}
                  feature={f}
                  selected={amenities.includes(f.key)}
                  onToggle={handleAmenityToggle}
                />
              ))}
              {filteredFeatures.length === 0 && (
                <p className="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Nessun risultato.
                </p>
              )}
            </div>
          </section>

          {/* Posizione */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Posizione
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Imposta la posizione sulla mappa o inserisci lat/lng manualmente.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
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
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Latitudine
                  </label>
                  <input
                    name="lat"
                    placeholder="45.478…"
                    value={form.lat}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Longitudine
                  </label>
                  <input
                    name="lng"
                    placeholder="9.156…"
                    value={form.lng}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Regole della casa */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Regole della casa
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Check-in (da)
                </label>
                <input
                  type="time"
                  value={rules.checkInFrom}
                  onChange={(e) =>
                    setRules((r) => ({ ...r, checkInFrom: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Check-in (fino a)
                </label>
                <input
                  type="time"
                  value={rules.checkInTo}
                  onChange={(e) =>
                    setRules((r) => ({ ...r, checkInTo: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Check-out entro
                </label>
                <input
                  type="time"
                  value={rules.checkOutBy}
                  onChange={(e) =>
                    setRules((r) => ({ ...r, checkOutBy: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          </section>

          {/* Cancellazione */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Termini di cancellazione
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Politica
                </label>
                <select
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
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="free_until_5_days">
                    Gratuita fino a 5 giorni prima
                  </option>
                  <option value="flexible">Flessibile</option>
                  <option value="strict">Rigida</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nota (opzionale)
                </label>
                <input
                  placeholder="Dettagli aggiuntivi sulla cancellazione"
                  value={cancellation.note ?? ""}
                  onChange={(e) =>
                    setCancellation((c) => ({ ...c, note: e.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          </section>

          {/* Sticky Actions */}
          <div className="sticky bottom-4 z-10">
            <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="inline-flex h-11 items-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Salvataggio in corso…" : "Salva"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
