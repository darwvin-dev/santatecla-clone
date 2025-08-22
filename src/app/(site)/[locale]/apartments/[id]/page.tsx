"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ClientLayoutWrapper from "@/app/(site)/[locale]/components/ClientLayoutWrapper";
import ApartmentsGalerry from "@/app/(site)/[locale]/components/apartments/ApartmentsGalerry";
import ApartmentsDetails from "@/app/(site)/[locale]/components/apartments/ApartmentsDetails";
import Loading from "@/app/(site)/[locale]/components/loading";
import ApartmentRules from "@/app/(site)/[locale]/components/apartments/ApartmentRules";

// ⬇️ dynamic را بیرون از Hook صدا بزن (بدون useMemo)
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
        در حال بارگذاری نقشه…
      </div>
    ),
  }
);

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
  cir: string;
  cin: string;
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
            [json.image, ...(Array.isArray(json.gallery) ? json.gallery : [])]
              .filter((x): x is string => typeof x === "string" && !!x)
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
          cir: data.cir ?? "",
          cin: data.cin ?? "",
        }}
      />

      {hasCoords && (
        <PropertyMapClient
          lat={lat}
          lng={lng}
        />
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
