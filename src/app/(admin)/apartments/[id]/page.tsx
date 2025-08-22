"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Amenity, Cancellation, Rules } from "@/models/Apartment";
import {
  FEATURES,
  FeaturesPicker,
} from "@/app/(site)/[locale]/components/admin/sections/FeaturesPicker";
import { Section } from "@/app/(site)/[locale]/components/admin/sections/Section";
import { ImagesManager } from "@/app/(site)/[locale]/components/admin/sections/ImagesManager";
import { LocationFields } from "@/app/(site)/[locale]/components/admin/sections/LocationFields";

type FinalItem =
  | { kind: "existing"; url: string }
  | { kind: "new"; file: File };

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
    cir: "",
    cin: ""
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
  const [finalOrder, setFinalOrder] = useState<FinalItem[]>([]);

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
          cin: a.cin ?? "",
          cir: a.cir ?? "",
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
    fd.append("cir", form.cir);
    fd.append("cin", form.cin);

    if (form.lat && form.lng) {
      fd.append("lat", form.lat);
      fd.append("lng", form.lng);
    }

    fd.append("amenities", JSON.stringify(amenities));
    fd.append("rules", JSON.stringify(rules));
    fd.append("cancellation", JSON.stringify(cancellation));

    if (coverImage) fd.append("image", coverImage);

    const final = finalOrder.length
      ? finalOrder
      : [
          ...existingGallery.map((url) => ({ kind: "existing" as const, url })),
          ...galleryNew.map((file) => ({ kind: "new" as const, file })),
        ];

    const newFilesInOrder = final
      .filter((x) => x.kind === "new")
      .map((x: any) => x.file as File);
    newFilesInOrder.forEach((file) => fd.append("galleryNew[]", file));

    let n = 0;
    const orderTokens = final.map((x) =>
      x.kind === "existing" ? (x as any).url : `new:${n++}`
    );
    fd.append("galleryOrder", JSON.stringify(orderTokens));

    fd.append(
      "keepGallery",
      JSON.stringify(
        final.filter((x) => x.kind === "existing").map((x: any) => x.url)
      )
    );
    galleryNew.forEach((file) => fd.append("galleryNew[]", file));

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
          <ImagesManager
            existingCover={existingCover}
            coverImage={coverImage}
            onCoverChange={handleCoverChange}
            existingGallery={existingGallery}
            setExistingGallery={setExistingGallery}
            galleryNew={galleryNew}
            setGalleryNew={setGalleryNew}
            onGalleryNewChange={handleGalleryNewChange}
            onRemoveExisting={removeExistingGalleryItem}
            onRemoveNew={removeNewGalleryIndex}
            existingPlan={existingPlan}
            planImage={planImage}
            removePlan={removePlan}
            setRemovePlan={setRemovePlan}
            onPlanChange={handlePlanChange}
            onFinalOrderChange={(items) => {
              const compact: FinalItem[] = items.map((x) =>
                x.kind === "existing"
                  ? { kind: "existing", url: x.url }
                  : { kind: "new", file: x.file }
              );
              setFinalOrder(compact);
            }}
          />

          {/* Servizi & Dotazioni */}
          <FeaturesPicker
            featureQuery={featureQuery}
            setFeatureQuery={setFeatureQuery}
            features={filteredFeatures}
            amenities={amenities}
            setAmenities={setAmenities}
          />

          {/* Posizione */}
          <LocationFields
            address={form.address}
            lat={form.lat}
            lng={form.lng}
            onChange={handleChange}
            onPick={(lat, lng) =>
              setForm((f) => ({ ...f, lat: String(lat), lng: String(lng) }))
            }
          />

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
