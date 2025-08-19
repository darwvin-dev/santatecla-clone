"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ClientLayoutWrapper from "@/app/components/ClientLayoutWrapper";
import ApartmentsGalerry from "@/app/components/apartments/ApartmentsGalerry";
import ApartmentsDetails from "@/app/components/apartments/ApartmentsDetails";
import Loading from "@/app/components/loading";
import PropertyMap from "@/app/components/apartments/PropertyMap";
import ApartmentRules from "@/app/components/apartments/ApartmentRules";

/* ---------- Types aligned with your model ---------- */
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

  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
  lat?: number;
  lng?: number;
};

export default function PropertyIntro() {
  const params = useParams();

  // ⚠️ اسم پارامتر باید دقیقا با نام فولدر داینامیک یکی باشد: [title] یا [name]
  const title = useMemo(
    () =>
      typeof params?.title === "string"
        ? params.title
        : Array.isArray(params?.title)
        ? params.title[0]
        : "",
    [params]
  );

  const [data, setData] = useState<ApartmentDTO | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!title) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/apartments/${encodeURIComponent(title)}`, {
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
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Fetch failed";
          setErr(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [title]);

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

  // GeoJSON: [lng, lat] —> به ترتیب صحیح به کامپوننت نقشه بده
  const lat = data.lat ?? data.location?.coordinates?.[1];
  const lng = data.lng ?? data.location?.coordinates?.[0];

  return (
    <ClientLayoutWrapper>
      <ApartmentsGalerry images={images} name={data.title} />

      {/* مطابق تایپ props کامپوننتت */}
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

      <PropertyMap lat={lat} lng={lng} addressLabel={data.address} />

      <ApartmentRules
        data={{
          rules: data.rules ?? null,
          cancellation: data.cancellation ?? null,
        }}
      />
    </ClientLayoutWrapper>
  );
}
