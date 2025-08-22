"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Section } from "./Section";

const MapPicker = dynamic(() => import("../MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse grid place-items-center text-slate-500">
      Caricamento mappa…
    </div>
  ),
});

export function LocationFields({
  address,
  lat,
  lng,
  onChange,
  onPick,
}: {
  address: string;
  lat: string;
  lng: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPick: (lat: number, lng: number) => void;
}) {
  return (
    <Section
      title="Posizione"
      desc="Imposta la posizione sulla mappa o inserisci lat/lng manualmente."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <MapPicker initialAddress={address} onPick={onPick} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Latitudine
            </label>
            <input
              name="lat"
              placeholder="45.478…"
              value={lat}
              onChange={onChange}
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
              value={lng}
              onChange={onChange}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
