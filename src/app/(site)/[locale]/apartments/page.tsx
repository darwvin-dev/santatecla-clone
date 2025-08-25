"use client";

import { useEffect, useState } from "react";
import { Apartment } from "@/types/Apartment";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import ApartmentsHeader from "../components/Home/ApartmentsHeader";
import ApartmentCard from "../components/apartments/ApartmentCard";
import Loading from "../components/loading";

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [order, setOrder] = useState<
    "" | "date_desc" | "date_asc" | "alpha_asc" | "alpha_desc"
  >("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    async function fetchApartments() {
      setIsLoading(true);
      const res = await fetch(`/api/apartments?order=${order}`);
      const data = await res.json();
      setApartments(data);
      setIsLoading(false);
    }

    fetchApartments();
  }, [order]);

  if (isLoading) return <Loading />;

  return (
    <ClientLayoutWrapper>
      <section className="row padding-y-100-100">
        <ApartmentsHeader order={order} setOrder={setOrder} />

        {apartments?.map((apartment, index) => (
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
