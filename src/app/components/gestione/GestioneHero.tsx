import { DynamicPart } from "@/types/DynamicPart";
import React from "react";

export default function GestioneHero({ hero }: { hero: DynamicPart | undefined }) {
  return (
    <section className="row property-intro-wrap">
      <h1 className="sr-only color-white">Gestione</h1>
      <div
        style={{
          backgroundImage:
            `url(${hero?.image})`,
        }}
        className="living-intro-background set-background-img vw-100 d-flex align-items-center justify-content-center position-relative"
      >
        <div className="overlay-black-20"></div>
        <div className="col-12 col-sm-10 col-lg-7 col-xl-6 col-xxl-5">
          <h2
            className="homepage-title mb-0 ff-sans fw-200 fz-60 color-white lh-xs text-center"
            style={{ zIndex: 1, whiteSpace: "pre-line" }}
          >
            {hero?.title}
          </h2>
        </div>
      </div>
    </section>
  );
}
