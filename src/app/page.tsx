"use client";

import { useEffect, useMemo, useState } from "react";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import { Apartment } from "@/types/Apartment";
import HeroSection from "./components/Home/HeroSection";
import HomeAbout from "./components/Home/HomeAbout";
import ApartmentsSection from "./components/Home/ApartmentsSection";
import ServicesSection from "./components/Home/ServicesSection";
import { DynamicPart } from "@/types/DynamicPart";

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [homeParts, setHomeParts] = useState<DynamicPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // فِچ موازی
        const [aRes, dRes] = await Promise.all([
          fetch("/api/apartments", { cache: "no-store" }),
          fetch("/api/dynamic-parts?page=Home", { cache: "no-store" }),
        ]);

        if (!aRes.ok) throw new Error("Errore nel caricamento degli appartamenti.");
        if (!dRes.ok) throw new Error("Errore nel caricamento dei contenuti Home.");

        const [aData, dData] = await Promise.all([aRes.json(), dRes.json()]);

        setApartments(aData ?? []);
        setHomeParts(dData ?? []);
      } catch (e: any) {
        setError(e?.message || "Errore di rete.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hero = useMemo(
    () => homeParts.find((h) => h.key === "hero"),
    [homeParts]
  );

  const about = useMemo(
    () => homeParts.find((h) => h.key === "About"),
    [homeParts]
  );

  return (
    <ClientLayoutWrapper>
      {loading && <div className="container py-4">Caricamento…</div>}
      {error && <div className="container py-4 text-danger">{error}</div>}
      <HeroSection hero={hero} />

      <HomeAbout about={about} />
      <ApartmentsSection apartments={apartments} />
      <ServicesSection />
          <section
        id="slider-invertito"
        className="row padding-y-90-120 overflow-hidden design-team-wrapper"
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-5 col-lg-6">
              <div
                className="row position-relative"
                id="teamsSlideImagesDesktop"
              >
                <div
                  dir="rtl"
                  className="swiper team-swiper-images swiper-initialized swiper-horizontal swiper-pointer-events swiper-rtl"
                  id="teamsSlideImages"
                >
                  <div
                    className="swiper-wrapper"
                    id="swiper-wrapper-57b6a651edc5b3f6"
                    aria-live="polite"
                    style={{
                      transitionDuration: "0ms",
                      transform: "translate3d(869px, 0px, 0px)",
                    }}
                  >
                    <div
                      className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next"
                      data-swiper-slide-index="1"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                      role="group"
                      aria-label="2 / 3"
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="swiper-slide swiper-slide-duplicate swiper-slide-prev"
                      data-swiper-slide-index="2"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                      role="group"
                      aria-label="3 / 3"
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_214367292-1920x2410.jpeg)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="swiper-slide swiper-slide-active"
                      data-swiper-slide-index="0"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                      role="group"
                      aria-label="1 / 3"
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_242806454-1920x1280.jpeg)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="swiper-slide swiper-slide-next"
                      data-swiper-slide-index="1"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                      role="group"
                      aria-label="2 / 3"
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="swiper-slide swiper-slide-duplicate-prev"
                      data-swiper-slide-index="2"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                      role="group"
                      aria-label="3 / 3"
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_214367292-1920x2410.jpeg)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
                      data-swiper-slide-index="0"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                      role="group"
                      aria-label="1 / 3"
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_242806454-1920x1280.jpeg)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next"
                      data-swiper-slide-index="1"
                      role="group"
                      aria-label="2 / 3"
                      style={{ width: "419.5px", marginLeft: "15px" }}
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{
                          backgroundImage:
                            "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg)",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span
                    className="swiper-notification"
                    aria-live="assertive"
                    aria-atomic="true"
                  ></span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column justify-content-between slider-col-txt">
              <div className="position-relative team-wrapper">
                <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                  Esperienze a Milano{" "}
                </h2>
                <div id="teamsSlideImagesMobile"></div>

                <div className="swiper-button-wrap pos-nav-change-first-slider">
                  <div
                    className="swiper-button-prev btn-only-arrow only-arrow-black"
                    tabIndex={0}
                    role="button"
                    aria-label="Previous slide"
                    aria-controls="swiper-wrapper-15582dbeb6117d6f"
                  >
                    <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        y="0"
                        viewBox="0 0 27 27"
                        xmlSpace="preserve"
                      >
                        <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                      </svg>{" "}
                    </div>
                  </div>
                  <div
                    className="swiper-button-next btn-only-arrow only-arrow-black"
                    tabIndex={0}
                    role="button"
                    aria-label="Next slide"
                    aria-controls="swiper-wrapper-15582dbeb6117d6f"
                  >
                    <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        y="0"
                        viewBox="0 0 27 27"
                        xmlSpace="preserve"
                      >
                        <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                      </svg>{" "}
                    </div>
                  </div>
                </div>

                <div className="swiper team-swiper swiper-fade swiper-initialized swiper-horizontal swiper-pointer-events">
                  <div
                    className="swiper-wrapper"
                    id="swiper-wrapper-15582dbeb6117d6f"
                    aria-live="polite"
                    style={{ transitionDuration: "0ms" }}
                  >
                    <div
                      className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-next"
                      data-swiper-slide-index="1"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 1,
                        transform: "translate3d(0px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="2 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Cena sul tram{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Per trascorrere una serata indimenticabile nella
                            nostra bellissima Milano, ecco a voi la cena
                            romantica per eccellenza a bordo di un tram storico.
                            Mentre godete della cena in tranquillità, fuori dal
                            finestrino scorrono i luoghi più iconici della
                            città, da Piazza Castello, al Duomo fino alla
                            Darsena.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-prev"
                      data-swiper-slide-index="2"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 1,
                        transform: "translate3d(-292px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="3 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Giro in 500 d'epoca{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Vuoi visitare Milano da un punto di vista unico e in
                            vero stile italiano? Visita la città a bordo di una
                            Fiat 500 vintage restaurata! Ammirate la città dal
                            finestrino di un’auto iconica e dal fascino
                            irresistibile come dei veri local. Non perderti
                            questa esperienza urbana da ricordare.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-slide pl-1 swiper-slide-visible swiper-slide-active"
                      data-swiper-slide-index="0"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 1,
                        transform: "translate3d(-583px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="1 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Tramonto sulla cima del Duomo{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Ammira lo skyline di Milano da un punto di vista
                            eccezionale. Prenotando il biglietto per la terrazza
                            Duomo all’ora del tramonto, potrai goderti lo
                            spettacolo unico del sole che cala fra le guglie.
                            Non perderti questa esperienza indimenticabile.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-slide pl-1 swiper-slide-visible swiper-slide-next"
                      data-swiper-slide-index="1"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 0,
                        transform: "translate3d(-875px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="2 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Cena sul tram{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Per trascorrere una serata indimenticabile nella
                            nostra bellissima Milano, ecco a voi la cena
                            romantica per eccellenza a bordo di un tram storico.
                            Mentre godete della cena in tranquillità, fuori dal
                            finestrino scorrono i luoghi più iconici della
                            città, da Piazza Castello, al Duomo fino alla
                            Darsena.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-slide pl-1 swiper-slide-duplicate-prev"
                      data-swiper-slide-index="2"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 0,
                        transform: "translate3d(-1166px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="3 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Giro in 500 d'epoca{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Vuoi visitare Milano da un punto di vista unico e in
                            vero stile italiano? Visita la città a bordo di una
                            Fiat 500 vintage restaurata! Ammirate la città dal
                            finestrino di un’auto iconica e dal fascino
                            irresistibile come dei veri local. Non perderti
                            questa esperienza urbana da ricordare.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-active"
                      data-swiper-slide-index="0"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 0,
                        transform: "translate3d(-1458px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="1 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Tramonto sulla cima del Duomo{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Ammira lo skyline di Milano da un punto di vista
                            eccezionale. Prenotando il biglietto per la terrazza
                            Duomo all’ora del tramonto, potrai goderti lo
                            spettacolo unico del sole che cala fra le guglie.
                            Non perderti questa esperienza indimenticabile.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-next"
                      data-swiper-slide-index="1"
                      style={{
                        width: "291.5px",
                        transitionDuration: "0ms",
                        opacity: 0,
                        transform: "translate3d(-1749px, 0px, 0px)",
                        minHeight: "471.333px",
                      }}
                      role="group"
                      aria-label="2 / 3"
                    >
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Cena sul tram{" "}
                        </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>
                            Per trascorrere una serata indimenticabile nella
                            nostra bellissima Milano, ecco a voi la cena
                            romantica per eccellenza a bordo di un tram storico.
                            Mentre godete della cena in tranquillità, fuori dal
                            finestrino scorrono i luoghi più iconici della
                            città, da Piazza Castello, al Duomo fino alla
                            Darsena.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span
                    className="swiper-notification"
                    aria-live="assertive"
                    aria-atomic="true"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientLayoutWrapper>
  );
}
