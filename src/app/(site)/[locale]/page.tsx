"use client";

import { useEffect, useMemo, useState } from "react";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import { Apartment } from "@/types/Apartment";
import HeroSection from "./components/Home/HeroSection";
import HomeAbout from "./components/Home/HomeAbout";
import ApartmentsSection from "./components/Home/ApartmentsSection";
import ServicesSection from "./components/Home/ServicesSection";
import { DynamicPart } from "@/types/DynamicPart";
import Loading from "./components/loading";
import ExperiencesSection from "./components/Home/ExperiencesSection";

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [homeParts, setHomeParts] = useState<DynamicPart[]>([]);
  const [experiences, setExperiences] = useState<DynamicPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [aRes, dRes, deRes] = await Promise.all([
          fetch("/api/apartments", { cache: "no-store" }),
          fetch("/api/dynamic-parts?page=Home", { cache: "no-store" }),
          fetch("/api/dynamic-parts?page=Home&parentId=all&key=experiences", {
            cache: "no-store",
          }),
        ]);

        if (!aRes.ok)
          throw new Error("Errore nel caricamento degli appartamenti.");
        if (!dRes.ok)
          throw new Error("Errore nel caricamento dei contenuti Home.");

        const [aData, dData, deData] = await Promise.all([
          aRes.json(),
          dRes.json(),
          deRes.json(),
        ]);

        setApartments(aData ?? []);
        setHomeParts(dData ?? []);
        setExperiences(deData ?? []);
      } catch (e: any) {
        setError(e?.message || "Errore di rete.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hero = useMemo(
    () => homeParts.find((h) => h.key === "hero"),
    [homeParts]
  );

  const about = useMemo(
    () => homeParts.find((h) => h.key === "About"),
    [homeParts]
  );

  // if (loading) return <Loading />;

  return (
    <ClientLayoutWrapper>
      {error && <div className="container py-4 text-danger">{error}</div>}
      <HeroSection hero={hero} />
      <HomeAbout about={about} />
      <ApartmentsSection apartments={apartments} />
      <ServicesSection />
      <ExperiencesSection experiences={experiences} />
    </ClientLayoutWrapper>
  );
}
