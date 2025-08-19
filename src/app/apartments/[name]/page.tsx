"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ClientLayoutWrapper from "@/app/components/ClientLayoutWrapper";
import ApartmentsGalerry from "@/app/components/apartments/ApartmentsGalerry";
import ApartmentsDetails from "@/app/components/apartments/ApartmentsDetails";
import Loading from "@/app/components/loading";

export default function PropertyIntro() {
  const params = useParams();
  const name = useMemo(
    () =>
      typeof params?.name === "string"
        ? params.name
        : Array.isArray(params?.name)
        ? params.name[0]
        : "",
    [params]
  );

  const [data, setData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!name) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/apartments/${encodeURIComponent(name)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setData(json);
          console.log(json);
          setImages([json.image, ...json.gallery]);
          console.log(images)
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Fetch failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [name]);

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
        <p>eerrr</p>
      </ClientLayoutWrapper>
    );
  }

  return (
    <ClientLayoutWrapper>
      <ApartmentsGalerry images={images} name={data?.title} />
      <ApartmentsDetails data={data} />
    </ClientLayoutWrapper>
  );
}
