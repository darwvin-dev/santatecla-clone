"use client";

import { useEffect, useState } from "react";
import ApartmentCard from "./components/Home/ApartmentCard";
import ApartmentsHeader from "./components/Home/ApartmentsHeader";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import { Apartment } from "@/types/Apartment";

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

  return (
    <ClientLayoutWrapper>
      <div className="wrap container-fluid">
        <div className="content row">
          <main className="main col-12">
            <section className="row padding-y-100-100">
              <ApartmentsHeader />

              {apartments?.map((apartment, index) => (
                <div className="col-12 mb-5" key={index}>
                  <ApartmentCard {...apartment} />
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
