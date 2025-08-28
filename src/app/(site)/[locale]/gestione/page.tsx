"use client";

import React, { useEffect, useMemo, useState } from "react";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import GestioneHero from "../components/gestione/GestioneHero";
import GestioneAbout from "../components/gestione/GestioneAbout";
import ApartmentsSection from "../components/Home/ApartmentsSection";
import { Apartment } from "@/types/Apartment";
import Loading from "../components/loading";
import { DynamicPart } from "@/types/DynamicPart";

export default function page() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [gestione, setGestione] = useState<DynamicPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [aRes, gRes] = await Promise.all([
          fetch("/api/apartments", { cache: "no-store" }),
          fetch("/api/dynamic-parts?page=Gestione", { cache: "no-store" }),
        ]);

        if (!aRes.ok)
          throw new Error("Errore nel caricamento degli appartamenti.");

        const [aData, gData] = await Promise.all([aRes.json(), gRes.json()]);

        setApartments(aData ?? []);
        setGestione(gData ?? []);
      } catch (e: any) {
        setError(e?.message || "Errore di rete.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hero = useMemo(
    () => gestione.find((g) => g.key === "hero"),
    [gestione]
  );

  const abouts = useMemo(
    () => gestione.filter((h) => h.key === "about"),
    [gestione]
  );

  // if (loading) return <Loading fullscreen />;

  return (
    <ClientLayoutWrapper>
      <GestioneHero hero={hero} />
      <GestioneAbout abouts={abouts} />
      <ApartmentsSection apartments={apartments} />
    </ClientLayoutWrapper>
  );
}
