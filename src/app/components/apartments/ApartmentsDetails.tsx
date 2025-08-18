// ApartmentsDetails.tsx
import Image from "next/image";
import React from "react";

type Feature = { label: string; icon: string };

const FEATURES: Feature[] = [
  { label: "Macchina del caffè", icon: "/features-icon/coffee-machine.svg" },
  { label: "Aria condizionata", icon: "/features-icon/air-conditioning.svg" },
  { label: "Bollitore", icon: "/features-icon/kettle.svg" },
  { label: "Tostapane", icon: "/features-icon/toaster.svg" },
  { label: "Lavastoviglie", icon: "/features-icon/dishwasher.svg" },
  { label: "Self Check-in", icon: "/features-icon/self-check-in.svg" },
  { label: "TV", icon: "/features-icon/tv.svg" },
  { label: "Lavatrice", icon: "/features-icon/lavatrice.svg" },
  { label: "Set di cortesia", icon: "/features-icon/set-di-cortesia.svg" },
  { label: "Microonde", icon: "/features-icon/microonde.svg" },
  { label: "Biancheria", icon: "/features-icon/biancheria.svg" },
  { label: "Culla su richiesta", icon: "/features-icon/culla-su-richiesta.svg" },
  { label: "WiFi", icon: "/features-icon/wifi.svg" },
  { label: "Parcheggio esterno", icon: "/features-icon/parcheggio-esterno.svg" },
  { label: "Animali ammessi", icon: "/features-icon/animali-ammessi.svg" },
  { label: "Asciugacapelli", icon: "/features-icon/asciugacapelli.svg" },
  { label: "Balcone", icon: "/features-icon/balcone.svg" },
];

export default function ApartmentsDetails() {
  return (
    <section className="row padding-y-100-100 info-wrap-property">
      <div className="container">
        <div className="row mb-md-5">
          <div className="col-12 col-lg-5">
            <p className="ff-sans fw-400 fz-21 color-black lh-sm">
              CityLife | Via Emanuele Filiberto 14
            </p>

            <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm padding-y-0-40">
              <p>
                Santa Tecla Living vi propone, per il vostro alloggio nella
                città di Milano, questo appartamento di nuova costruzione,
                appena ristrutturato, in via Emanuele Filiberto 14, a soli 10
                minuti a piedi da City Life. Dispone di una camera da letto,
                grande e luminosissimo soggiorno con cucina a vista,
                equipaggiata con elettrodomestici di alta gamma, e un bagno con
                box doccia. Al piano inferiore una grande zona living con divano
                letto ed un letto aggiuntivo e un secondo bagno.
              </p>
              <p>
                Il quartiere frutto di una riqualificazione totale, è diventato
                un quartiere molto alla moda, moderno con spazi verdi su cui
                svettano i tre iconoci grattacieli, simbolo dello skyline
                milanese, aree pubbliche polifunzionali e palazzi in stile
                Liberty che contrastano e arricchiscono lo stile futurista di
                questo quartiere. Il cuore pulsante di CityLife è Piazza Tre
                Torri, raggiungibile dall’appartamento in soli 10 minuti a
                piedi. Questa grande area pedonale dà accesso al CityLife
                Shopping District, centro commerciale all’interno del quale si
                trovano più di 80 negozi e 20 ristoranti.
              </p>
              <p>&nbsp;</p>
              <p>
                CIR: 015146-CIM-05557
                <br />
                CIN: IT015146B4VIB7FRTT
              </p>
            </div>

            <div className="row">
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Ospiti</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">5</div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Superficie</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">95 mq</div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Piano</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">Su due piani</div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Bagni</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">2</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="col-12 col-lg-6 offset-lg-1" style={{ marginTop: "37px" }}>
            <div className="row">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="col-12 col-sm-6 col-md-4 col-lg-6 mt-3 d-flex flex-row align-items-center"
                >
                  <span className="features-icon" aria-hidden="true">
                    <Image
                      src={f.icon}
                      alt={f.label}
                      width={28}
                      height={28}
                      loading="lazy"
                    />
                  </span>
                  <span className="ff-sans fw-400 fz-18 color-black lh-sm pl-3">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Links */}
        <div className="row d-flex flex-row justify-content-center padding-y-90-90 mb-md-5">
          <div className="col-12 col-md-11 col-lg-9 col-xl-10 col-xxl-8">
            <div className="row d-flex flex-row justify-content-center single-property-files">
              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                <a
                  href="https://www.santateclaliving.com/wp-content/uploads/2023/02/20230302_planimetria-arredata_piano-terra-e-seminterrato_mgk-scaled.jpg"
                  target="_blank"
                  rel="nofollow noopener"
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>Planimetria</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_planimetria fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_planimetria fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>

              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4 single-property-email">
                <a
                  href="mailto:reservation@santateclaliving.com?subject=Richiedi info per Nabila&amp;body=Salve%2C sono interessato a ricevere informazioni sull%E2%80%99appartamento con codice%3A Nabila."
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>Richiedi info</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chiedi-info fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chiedi-info fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>

              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                <a
                  href="tel:+393519361241"
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>Chiamaci</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chiama-tel fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chiama-tel fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>

              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                <a
                  href="https://wa.me/393519361241?text=Salve%2C sono interessato a ricevere informazioni sull%E2%80%99appartamento con codice%3A Nabila."
                  target="_blank"
                  rel="nofollow noopener"
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>Contattaci</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chat-wa fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chat-wa fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
