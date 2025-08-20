"use client"

import React, { useEffect, useState } from "react";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import GestioneHero from "../components/gestione/GestioneHero";
import GestioneAbout from "../components/gestione/GestioneAbout";
import ApartmentsSection from "../components/Home/ApartmentsSection";
import { Apartment } from "@/types/Apartment";
import Loading from "../components/loading";

export default function page() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [aRes] = await Promise.all([
          fetch("/api/apartments", { cache: "no-store" }),
        ]);

        if (!aRes.ok)
          throw new Error("Errore nel caricamento degli appartamenti.");

        const [aData] = await Promise.all([aRes.json()]);

        setApartments(aData ?? []);
      } catch (e: any) {
        setError(e?.message || "Errore di rete.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading fullscreen />;

  return (
    <ClientLayoutWrapper>
      <GestioneHero />
      <GestioneAbout />
      <ApartmentsSection apartments={apartments} />
    </ClientLayoutWrapper>
  );
}
