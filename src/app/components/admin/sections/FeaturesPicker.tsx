import React from "react";
import { Section } from "./Section";
import { FeatureCard } from "./FeatureCard";

export type Rules = { checkInFrom: string; checkInTo: string; checkOutBy: string };
export type Cancellation = { policy: "free_until_5_days" | "flexible" | "strict"; note?: string };
export type Amenity =
  | "macchina_caffe" | "aria_condizionata" | "bollitore" | "tostapane" | "lavastoviglie" | "self_check_in" | "tv" | "lavatrice" | "set_di_cortesia" | "microonde" | "biancheria" | "culla_su_richiesta" | "wifi" | "parcheggio_esterno" | "animali_ammessi" | "asciugacapelli" | "balcone";

export type Feature = { key: Amenity; label: string; icon: string };

export const FEATURES: Feature[] = [
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

export function FeaturesPicker({ featureQuery, setFeatureQuery, features, amenities, setAmenities }: {
  featureQuery: string;
  setFeatureQuery: (v: string) => void;
  features: Feature[];
  amenities: Amenity[];
  setAmenities: (v: Amenity[]) => void;
}) {
  const handleAmenityToggle = (key: Amenity) =>
    setAmenities(amenities.includes(key) ? amenities.filter((a) => a !== key) : [...amenities, key]);

  return (
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
          <button type="button" onClick={() => setAmenities(FEATURES.map((f) => f.key))}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Seleziona tutto</button>
          <button type="button" onClick={() => setAmenities([])}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Deseleziona</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <FeatureCard key={f.key} feature={f} selected={amenities.includes(f.key)} onToggle={handleAmenityToggle} />
        ))}
        {features.length === 0 && (
          <p className="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Nessun risultato.</p>
        )}
      </div>
    </Section>
  );
}

