"use client";

import { useEffect, useMemo, useState } from "react";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import HeroSection from "./components/Home/HeroSection";
import HomeAbout from "./components/Home/HomeAbout";
import ApartmentsSection from "./components/Home/ApartmentsSection";
import ServicesSection from "./components/Home/ServicesSection";
import ExperiencesSection from "./components/Home/ExperiencesSection";
import { Apartment } from "@/types/Apartment";
import { DynamicPart } from "@/types/DynamicPart";
import Head from "next/head";

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [homeParts, setHomeParts] = useState<DynamicPart[]>([]);
  const [experiences, setExperiences] = useState<DynamicPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        fetch("/api/apartments", { cache: "no-store" }),
        fetch("/api/dynamic-parts?page=Home", { cache: "no-store" }),
        fetch("/api/dynamic-parts?page=Home&parentId=all&key=experiences", {
          cache: "no-store",
        }),
      ];

      const [aRes, dRes, deRes] = await Promise.all(endpoints);

      if (!aRes.ok)
        throw new Error("Errore nel caricamento degli appartamenti.");
      if (!dRes.ok)
        throw new Error("Errore nel caricamento dei contenuti Home.");
      if (!deRes.ok)
        throw new Error("Errore nel caricamento delle esperienze.");

      const [aData, dData, deData] = await Promise.all([
        aRes.json(),
        dRes.json(),
        deRes.json(),
      ]);

      setApartments(aData ?? []);
      setHomeParts(dData ?? []);
      setExperiences(deData ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Errore di rete.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hero = useMemo(
    () => homeParts.find((h) => h.key === "hero"),
    [homeParts]
  );
  const about = useMemo(
    () => homeParts.find((h) => h.key === "About"),
    [homeParts]
  );

  const title = "Habitabio";
  useEffect(() => {
    document.title = title;
  }, [title]);

  if (loading) return;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Habitabio - Scopri appartamenti in affitto di alta qualità. Trova la tua casa ideale tra le nostre offerte."
        />
        <meta
          name="keywords"
          content="Habitabio, appartamenti, case in affitto, appartamenti in affitto, appartamenti vacanze"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Habitabio - Trova appartamenti da sogno in affitto per le tue vacanze o soggiorni." />
        <meta property="og:image" content="/path-to-image.jpg" />
        <meta property="og:url" content="https://habitabio.it" />
      </Head>

      <ClientLayoutWrapper>
        {error && <div className="container py-4 text-danger">{error}</div>}
        <HeroSection hero={hero} />
        <HomeAbout about={about} />
        <ApartmentsSection apartments={apartments} />
        <ServicesSection />
        <ExperiencesSection experiences={experiences} />
      </ClientLayoutWrapper>
    </>
  );
}
