"use client";

import { useEffect, useState } from "react";
import { Apartment } from "@/types/Apartment";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import ApartmentsHeader from "../components/Home/ApartmentsHeader";
import ApartmentCard from "../components/apartments/ApartmentCard";
import useSWR from "swr";
import Head from "next/head";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [order, setOrder] = useState<
    "" | "date_desc" | "date_asc" | "alpha_asc" | "alpha_desc"
  >("");
  const {
    data: apartments = [],
    isLoading,
    mutate,
  } = useSWR(`/api/apartments?order=${order}`, fetcher);

    const title = "Archivi Apartment - Habitabio";
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    mutate();
  }, [order]);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Scopri appartamenti in affitto di alta qualità. Trova la tua casa ideale tra le nostre offerte."
        />
        <meta
          name="keywords"
          content="appartamenti, case in affitto, appartamenti in affitto, appartamenti vacanze"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <ClientLayoutWrapper>
        <section className="row padding-y-100-100">
          <ApartmentsHeader order={order} setOrder={setOrder} />
          {apartments?.map((apartment: Apartment, index: number) => (
            <ApartmentCard
              {...apartment}
              reversed={index % 2 === 1}
              key={"APARTMENT_INDEX_" + index}
            />
          ))}
        </section>
      </ClientLayoutWrapper>
    </>
  );
}
