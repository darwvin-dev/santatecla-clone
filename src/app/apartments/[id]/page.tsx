"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ClientLayoutWrapper from "@/app/components/ClientLayoutWrapper";
import ApartmentsGalerry from "@/app/components/apartments/ApartmentsGalerry";
import ApartmentsDetails from "@/app/components/apartments/ApartmentsDetails";
import Loading from "@/app/components/loading";
import ApartmentRules from "@/app/components/apartments/ApartmentRules";
import dynamic from "next/dynamic";

/* ---------- Types ---------- */
type AmenityKey =
  | "macchina_caffe" | "aria_condizionata" | "bollitore" | "tostapane" | "lavastoviglie"
  | "self_check_in" | "tv" | "lavatrice" | "set_di_cortesia" | "microonde" | "biancheria"
  | "culla_su_richiesta" | "wifi" | "parcheggio_esterno" | "animali_ammessi" | "asciugacapelli" | "balcone";

type Rules = { checkInFrom?: string; checkInTo?: string; checkOutBy?: string };
type CancellationPolicy = "free_until_5_days" | "flexible" | "strict";
type Cancellation = { policy: CancellationPolicy; note?: string };

type ApartmentDTO = {
  title: string;
  image: string;
  gallery: string[];
  plan?: string | null;
  description: string;
  details?: string;
  guests: number;
  sizeSqm: number;
  floor?: string;
  bathrooms: number;
  address: string;
  addressDetail?: string;
  amenities: AmenityKey[];
  rules?: Rules | null;
  cancellation?: Cancellation | null;
  location?: { type: "Point"; coordinates: [number, number] };
  lat?: number;
  lng?: number;
};

const PropertyMapClient = dynamic(
  () => import("../../components/apartments/PropertyMap"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: 360,
          borderRadius: 12,
          background: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        در حال بارگذاری نقشه…
      </div>
    ),
  }
);

export default function PropertyIntro() {
  const params = useParams();

  const slug = useMemo(() => {
    const p: any = params;
    const raw =
      (typeof p?.id === "string" && p.id) ||
      (Array.isArray(p?.id) && p.id[0]) ||
      (typeof p?.title === "string" && p.title) ||
      (Array.isArray(p?.title) && p.title[0]) ||
      "";
    return decodeURIComponent(raw);
  }, [params]);

  const [data, setData] = useState<ApartmentDTO | null>(null);
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
        const res = await fetch(`/api/apartments/${encodeURIComponent(slug)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ApartmentDTO = await res.json();
        if (!cancelled) {
          setData(json);
          setImages(
            [json.image, ...(Array.isArray(json.gallery) ? json.gallery : [])].filter(
              (x): x is string => typeof x === "string" && !!x
            )
          );
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

  if (loading) {
    return (
      <ClientLayoutWrapper>
        <Loading />
      </ClientLayoutWrapper>
    );
  }

  if (err) {
    return (
      <ClientLayoutWrapper>
        <p style={{ color: "crimson" }}>خطا: {err}</p>
      </ClientLayoutWrapper>
    );
  }

  if (!data) {
    return (
      <ClientLayoutWrapper>
        <p>چیزی پیدا نشد.</p>
      </ClientLayoutWrapper>
    );
  }

  // GeoJSON: [lng, lat]
  const lat = data.lat ?? data.location?.coordinates?.[1];
  const lng = data.lng ?? data.location?.coordinates?.[0];
  const hasCoords = typeof lat === "number" && typeof lng === "number";

  return (
    <ClientLayoutWrapper>
      <ApartmentsGalerry images={images} name={data.title} />

      <ApartmentsDetails
        data={{
          title: data.title,
          address: data.address,
          details: data.details,
          guests: data.guests,
          sizeSqm: data.sizeSqm,
          floor: data.floor,
          bathrooms: data.bathrooms,
          amenities: data.amenities,
          plan: data.plan ?? null,
        }}
      />

      {hasCoords && (
        <PropertyMapClient lat={lat as number} lng={lng as number} title={data.title} />
      )}

      <ApartmentRules
        data={{
          rules: data.rules ?? null,
          cancellation: data.cancellation ?? null,
        }}
      />
    </ClientLayoutWrapper>
  );
}
