"use client";

import { useEffect, useState } from "react";
import { Apartment } from "@/types/Apartment";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import ApartmentsHeader from "../components/Home/ApartmentsHeader";
import ApartmentCard from "../components/apartments/ApartmentCard";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const [order, setOrder] = useState<
    "" | "date_desc" | "date_asc" | "alpha_asc" | "alpha_desc"
  >("");
  const { data: apartments = [], isLoading, mutate } = useSWR(`/api/apartments?order=${order}`, fetcher);

  useEffect(() => {
    mutate()
  }, [order]);

  return (
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
  );
}
