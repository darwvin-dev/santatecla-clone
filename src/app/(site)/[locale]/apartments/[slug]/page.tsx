"use client";

import React, { useEffect, useMemo, useState } from "react";
import { redirect, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ClientLayoutWrapper from "@/app/(site)/[locale]/components/ClientLayoutWrapper";
import ApartmentsGalerry from "@/app/(site)/[locale]/components/apartments/ApartmentsGalerry";
import ApartmentsDetails from "@/app/(site)/[locale]/components/apartments/ApartmentsDetails";
import ApartmentRules from "@/app/(site)/[locale]/components/apartments/ApartmentRules";
import { useLocale } from "next-intl";
import { Apartment } from "@/types/Apartment";

const PropertyMapClient = dynamic(
  () => import("@/app/(site)/[locale]/components/apartments/PropertyMap"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 360,
          width: "100%",
          borderRadius: 12,
          background: "#f3f3f3",
          display: "grid",
          placeItems: "center",
        }}
      >
        Loading Map...
      </div>
    ),
  }
);

export default function PropertyIntro() {
  const params = useParams();
  const locale = useLocale();

  const slug = useMemo(() => {
    const p: any = params;
    const raw =
      (typeof p?.slug === "string" && p.slug) ||
      (Array.isArray(p?.slug) && p.slug[0]) ||
      (typeof p?.title === "string" && p.title) ||
      (Array.isArray(p?.title) && p.title[0]) ||
      "";
    return decodeURIComponent(raw);
  }, [params]);

  const [data, setData] = useState<Apartment | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/apartments/${slug}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Apartment = await res.json();
        if (!cancelled) {
          setData(json);
          setImages(
            [
              json.image,
              ...(Array.isArray(json.gallery) ? json.gallery : []),
            ].filter((x): x is string => typeof x === "string" && !!x)
          );
          document.title = `${json?.title} - Habitabio`;
        }
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Fetch failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading || !data) {
    return;
  }

  if (err) {
    return (
      <ClientLayoutWrapper>
        <p style={{ color: "crimson" }}>ERROR: {err}</p>
      </ClientLayoutWrapper>
    );
  }

  const lat: number | null =
    data.lat ?? data.location?.coordinates?.[1] ?? null;
  const lng: number | null =
    data.lng ?? data.location?.coordinates?.[0] ?? null;
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const coords = hasCoords
    ? ([lat as number, lng as number] as [number, number])
    : null;

  return (
    <ClientLayoutWrapper>
      <ApartmentsGalerry
        images={images}
        name={locale === "en" ? data.title_en || data.title : data.title}
      />

      <ApartmentsDetails data={data} />

      {coords && <PropertyMapClient coords={coords} />}

      <ApartmentRules
        data={{
          rules: data.rules ?? null,
          cancellation: data.cancellation ?? null,
        }}
      />
    </ClientLayoutWrapper>
  );
}
