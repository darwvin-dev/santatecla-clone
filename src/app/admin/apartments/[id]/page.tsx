"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

/* ------------ Types ------------ */
type Rules = { checkInFrom: string; checkInTo: string; checkOutBy: string };
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

type Feature = { key: Amenity; label: string; icon: string };

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

/* ------------ UI parts ------------ */
function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {desc ? <p className="mt-1 text-sm text-slate-600">{desc}</p> : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

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

/* ------------ Page (Edit) ------------ */
export default function EditApartmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

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

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [rules, setRules] = useState<Rules>({
    checkInFrom: "15:00",
    checkInTo: "19:00",
    checkOutBy: "10:00",
  });
  const [cancellation, setCancellation] = useState<Cancellation>({
    policy: "free_until_5_days",
    note: "",
  });

  // images (existing/new)
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
        setRules(
          a.rules ?? {
            checkInFrom: "15:00",
            checkInTo: "19:00",
            checkOutBy: "10:00",
          }
        );
        setCancellation(
          a.cancellation ?? { policy: "free_until_5_days", note: "" }
        );

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
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAmenityToggle = (key: Amenity) =>
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );

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
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    setGalleryNew((g) => [...g, ...Array.from(files)]);
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
      alert(
        "Errore nell’aggiornamento: " +
          (err?.response?.data?.error ?? "Sconosciuto")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------ States ------------ */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <Section title="Modifica Appartamento">
            <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          </Section>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-slate-50">
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  /* ------------ UI ------------ */
  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Modifica Appartamento
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Aggiorna informazioni, immagini, servizi e regole.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Info principali */}
          <Section title="Informazioni principali">
            <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 md:grid-cols-2">
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

            <div className="grid gap-4 md:grid-cols-3">
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
          </Section>

          {/* Immagini */}
          <Section title="Immagini">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Cover */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Immagine principale
                </label>
                {existingCover && !coverImage && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={existingCover}
                      alt="Cover attuale"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
                <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                  <span>Seleziona file</span>
                </label>
                {coverImage && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Nuova cover"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Galleria
                </label>

                {existingGallery.length > 0 && (
                  <>
                    <p className="text-sm text-slate-600 -mb-1">
                      Immagini esistenti (clic “Rimuovi” per eliminarle)
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {existingGallery.map((url) => (
                        <figure
                          key={url}
                          className="group relative overflow-hidden rounded-lg"
                        >
                          <img
                            src={url}
                            alt="Esistente"
                            className="h-28 w-full object-cover ring-1 ring-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryItem(url)}
                            className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow group-hover:block"
                          >
                            Rimuovi
                          </button>
                        </figure>
                      ))}
                    </div>
                  </>
                )}

                <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryNewChange}
                  />
                  <span>Aggiungi nuove immagini</span>
                </label>

                {galleryNew.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {galleryNew.map((f, i) => (
                      <figure
                        key={i}
                        className="group relative overflow-hidden rounded-lg"
                      >
                        <img
                          src={URL.createObjectURL(f)}
                          alt={`Nuova ${i + 1}`}
                          className="h-28 w-full object-cover ring-1 ring-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewGalleryIndex(i)}
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
                {existingPlan && !planImage && !removePlan && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={existingPlan}
                      alt="Planimetria attuale"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={removePlan}
                    onChange={(e) => {
                      setRemovePlan(e.target.checked);
                      if (e.target.checked) setPlanImage(null);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                  />
                  Rimuovi planimetria
                </label>
                {!removePlan && (
                  <>
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
                          alt="Nuova planimetria"
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Section>

          {/* Servizi & Dotazioni */}
          <Section title="Servizi & Dotazioni">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          </Section>

          {/* Posizione */}
          <Section
            title="Posizione"
            desc="Imposta la posizione sulla mappa o inserisci lat/lng manualmente."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <MapPicker
                  initialAddress={form.address}
                  onPick={(lat: number, lng: number) =>
                    setForm((f) => ({
                      ...f,
                      lat: String(lat),
                      lng: String(lng),
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
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
          </Section>

          {/* Regole & Cancellazione */}
          <Section title="Regole della casa">
            <div className="grid gap-4 md:grid-cols-3">
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
          </Section>

          <Section title="Termini di cancellazione">
            <div className="grid gap-4 md:grid-cols-2">
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
          </Section>

          {/* Sticky Actions */}
          <div className="sticky bottom-4 z-10">
            <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="inline-flex h-11 items-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Salvataggio in corso…" : "Aggiorna"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
