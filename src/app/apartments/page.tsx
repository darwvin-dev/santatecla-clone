"use client";

import { useEffect, useState } from "react";
import { Apartment } from "@/types/Apartment";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import ApartmentsHeader from "../components/Home/ApartmentsHeader";
import ApartmentCard from "../components/apartments/ApartmentCard";

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    async function fetchApartments() {
      const res = await fetch("/api/apartments");
      const data = await res.json();
      setApartments(data);
    }

    fetchApartments();
  }, []);

  // if(!apartments) return (<Error)

  return (
    <ClientLayoutWrapper>
      <section className="row padding-y-100-100">
        <ApartmentsHeader />

        {apartments?.map((apartment, index) => (
          <ApartmentCard {...apartment} reversed={index % 2 === 1} key={"APARTMENT_INDEX_" + index} />
        ))}
      </section>
    </ClientLayoutWrapper>
  );
}
