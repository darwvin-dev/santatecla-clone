import React from "react";

export default function GestioneAbout() {
  return (
    <section className="row padding-y-90-90 prop-section-about">
      <div className="w-100 position-relative overflow-hidden property-about-container">
        <div className="container h-100">
          <div className="row h-100">
            <div
              className="col-12 col-md-6 col-lg-6 prop-about-img-wrap"
              style={{ minHeight: "741.109px" }}
            >
              <div className="prop-about-img prop-minheight-img">
                <figure className="mb-0">
                  <img
                    data-src="https://www.santateclaliving.com/wp-content/uploads/2023/03/bagno_dettaglio_2-1920x1280.jpg"
                    alt=""
                    width="1920"
                    height="1280"
                    className="img-fluid lazy entered loaded"
                    data-ll-status="loaded"
                    src="https://www.santateclaliving.com/wp-content/uploads/2023/03/bagno_dettaglio_2-1920x1280.jpg"
                  />
                </figure>
              </div>
            </div>
            <div className="property-about-text col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between">
              <div>
                <h2 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                  Hai mai pensato di investire negli affitti a breve termine?{" "}
                </h2>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  <p>
                    Santa Tecla Living è il tuo partner per gestire il tuo
                    appartamento per affitti a breve termine.
                    <br />
                    Potrai beneficiare di tutti i vantaggi economici e in
                    termini di elasticità e liquidità della tua proprietà senza
                    la difficoltà di seguirne la gestione pratica. Operazioni di
                    check in, prenotazioni servizio di pulizie, lavanderia,
                    manutenzione, promozione per aumentare l’occupazione sono
                    tutte attività impegnative. Ti assicuriamo, grazie al nostro
                    team esperto, un supporto professionale per tutti questi
                    aspetti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
