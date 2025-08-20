import React from "react";

export default function GestioneHero() {
  return (
    
    <section className="row property-intro-wrap">
      <h1 className="sr-only color-white">Gestione</h1>
      <div
        style={{
          backgroundImage:
            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_158585580-scaled-e1678280883595-1920x998.jpeg);",
        }}
        className="living-intro-background set-background-img vw-100 d-flex align-items-center justify-content-center position-relative"
      >
        <div className="overlay-black-20"></div>
        <div className="col-12 col-sm-10 col-lg-7 col-xl-6 col-xxl-5">
          <h2
            className="homepage-title mb-0 ff-sans fw-200 fz-60 color-white lh-xs text-center"
            style={{ zIndex: 1 }}
          >
            Benvenuto in <br /> Santa Tecla Living{" "}
          </h2>
        </div>
      </div>
    </section>
  );
}
