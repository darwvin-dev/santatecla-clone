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
      <section className="row property-intro-wrap">
        <h1 className="sr-only color-white">Home</h1>
        <div style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/soggiorno_2-1920x1281.jpg);" }} className="living-intro-background set-background-img vw-100 d-none d-md-flex align-items-center justify-content-center position-relative">
          <div className="overlay-black-20"></div>
          <div className="col-12 col-sm-10 col-lg-7 col-xl-6 col-xxl-5">
            <h2 className="homepage-title mb-0 ff-sans fw-200 fz-60 color-white lh-xs text-center">
              La tua casa<br />lontano da casa          </h2>
          </div>
        </div>
        <div style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/soggiorno_2-crop-mobile.jpg)", backgroundPosition: "center left" }} className="living-intro-background set-background-img vw-100 d-flex d-md-none align-items-center justify-content-center position-relative">
          <div className="overlay-black-20"></div>
          <div className="col-12 col-sm-10 col-lg-7 col-xl-6 col-xxl-5">
            <h2 className="homepage-title mb-0 ff-sans fw-200 fz-60 color-white lh-xs text-center" style={{ zIndex: 1 }}>
              La tua casa<br />lontano da casa            </h2>
          </div>
        </div>
      </section>


      <section className="row padding-y-90-90 prop-section-about">
        <div className="w-100 position-relative overflow-hidden property-about-container">
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-12 col-md-6 col-lg-6 prop-about-img-wrap" style={{ minHeight: "659.021px" }}>
                <div className="prop-about-img prop-minheight-img">
                  <figure className="mb-0">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_dettaglio_5-1920x1280.jpg" alt="" width="1920" height="1280" className="img-fluid lazy entered loaded" data-ll-status="loaded" src="https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_dettaglio_5-1920x1280.jpg" />
                  </figure>
                </div>
              </div>
              <div className="property-about-text col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between">
                <div>
                  <h2 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                    Un' ospitalità straordinaria              </h2>
                  <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                    <p>Cosa ci fa sentire bene quando soggiorniamo lontano da casa? È quella sensazione di comfort e familiarità che ci mette a proprio agio come a casa nostra. Vogliamo offrirti i servizi e l’accoglienza di un hotel nella privacy di un appartamento, per un soggiorno business, leisure o in famiglia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <script>
            function videoMinHeightAbout() {
    if (window.sliderBtnVerticalPosition) {
      if (window.innerWidth >= 768) {
        var propVideo = $('.prop-video');
            var propVideoWrap = $('.prop-about-img-wrap');
            window.sliderBtnVerticalPosition(propVideo, propVideoWrap);
      }
    } else {
              setTimeout(videoMinHeightAbout, 500);
    }
  }
            window.addEventListener('load', function () {
              setTimeout(videoMinHeightAbout, 500);
  });

            function imgMinHeightAbout() {
    if (window.sliderBtnVerticalPosition) {
      if (window.innerWidth >= 768) {
        var propImage = $('.prop-minheight-img');
            var propImageWrap = $('.prop-about-img-wrap');
            window.sliderBtnVerticalPosition(propImage, propImageWrap);
      }
    } else {
              setTimeout(imgMinHeightAbout, 500);
    }
  }
            window.addEventListener('load', function () {
              window.imgMinHeightAbout();
  });
          </script> */}
      <section className="row padding-y-90-90 overflow-hidden prop-section-immobile">
        <div className="container">
          <div className="row">
            <div className="d-flex flex-column justify-content-between slider-col-txt">
              <div>
                <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                  I nostri appartamenti                </h2>
                <div id="propertySlideImagesMobile"></div>
                <div className="swiper-button-wrap pos-nav-change-first-slider">
                  <div className="swiper-button-prev btn-only-arrow only-arrow-black" tabIndex={0} role="button" aria-label="Previous slide" aria-controls="swiper-wrapper-15582dbeb6117d6f">
                    <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 27 27" xmlSpace="preserve"><path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path></svg>                  </div>
                  </div>
                  <div className="swiper-button-next btn-only-arrow only-arrow-black" tabIndex={0} role="button" aria-label="Next slide" aria-controls="swiper-wrapper-15582dbeb6117d6f">
                    <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 27 27" xmlSpace="preserve"><path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path></svg>                  </div>
                  </div>
                </div>
                <div className="swiper property-swiper swiper-fade swiper-initialized swiper-horizontal swiper-pointer-events">
                  <div className="swiper-wrapper" id="swiper-wrapper-588fd544878c6226" aria-live="polite" style={{ transitionDuration: "0ms" }}><div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 1, transform: "translate3d(0px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="2 / 3">
                    <div className="pt-1 pt-md-0 w-100 position-relative">
                      <a href="https://www.santateclaliving.com/?post_type=apartment&amp;p=4637" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                        Bourgie                          </a>
                    </div>
                    <div className="w-100 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                        Bellissimo e nuovissimo bilocale appena ristrutturato da architetto a due passi da Corso Buenos Aires. Camera e soggiorno con cucina a vista.                           </p>
                    </div>
                  </div><div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-prev" data-swiper-slide-index="2" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 1, transform: "translate3d(-292px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="3 / 3">
                      <div className="pt-1 pt-md-0 w-100 position-relative">
                        <a href="https://www.santateclaliving.com/apartments/castore/" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                          Castore                          </a>
                      </div>
                      <div className="w-100 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                          Bellissimo e nuovissimo appartamento, su due livelli, appena ristrutturato da architetto a due passi da City Life. Due camere, zona living con divano letto e cucina a vista, due bagni.                          </p>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-visible swiper-slide-active" data-swiper-slide-index="0" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 1, transform: "translate3d(-583px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="1 / 3">
                      <div className="pt-1 pt-md-0 w-100 position-relative">
                        <a href="https://www.santateclaliving.com/apartments/nabila/" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                          Nabila                          </a>
                      </div>
                      <div className="w-100 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                          Appartamento su due livelli appena ristrutturato a due passi da CityLife. Due camere, soggiorno con cucina a vista e due bagni.                           </p>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-visible swiper-slide-next" data-swiper-slide-index="1" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-875px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="2 / 3">
                      <div className="pt-1 pt-md-0 w-100 position-relative">
                        <a href="https://www.santateclaliving.com/?post_type=apartment&amp;p=4637" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                          Bourgie                          </a>
                      </div>
                      <div className="w-100 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                          Bellissimo e nuovissimo bilocale appena ristrutturato da architetto a due passi da Corso Buenos Aires. Camera e soggiorno con cucina a vista.                           </p>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-duplicate-prev" data-swiper-slide-index="2" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-1166px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="3 / 3">
                      <div className="pt-1 pt-md-0 w-100 position-relative">
                        <a href="https://www.santateclaliving.com/apartments/castore/" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                          Castore                          </a>
                      </div>
                      <div className="w-100 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                          Bellissimo e nuovissimo appartamento, su due livelli, appena ristrutturato da architetto a due passi da City Life. Due camere, zona living con divano letto e cucina a vista, due bagni.                          </p>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-active" data-swiper-slide-index="0" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-1458px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="1 / 3">
                      <div className="pt-1 pt-md-0 w-100 position-relative">
                        <a href="https://www.santateclaliving.com/apartments/nabila/" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                          Nabila                          </a>
                      </div>
                      <div className="w-100 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                          Appartamento su due livelli appena ristrutturato a due passi da CityLife. Due camere, soggiorno con cucina a vista e due bagni.                           </p>
                      </div>
                    </div><div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-1749px, 0px, 0px)", minHeight: "435.333px" }} role="group" aria-label="2 / 3">
                      <div className="pt-1 pt-md-0 w-100 position-relative">
                        <a href="https://www.santateclaliving.com/?post_type=apartment&amp;p=4637" className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline">
                          Bourgie                          </a>
                      </div>
                      <div className="w-100 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                          Bellissimo e nuovissimo bilocale appena ristrutturato da architetto a due passi da Corso Buenos Aires. Camera e soggiorno con cucina a vista.                           </p>
                      </div>
                    </div></div>
                  <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
              </div>
              <div className="swiper-cta">
                <a href="https://www.santateclaliving.com/apartments/" className="d-inline-flex align-items-center btn-rounded btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline text-center">
                  <span className="">Vedi tutti</span>
                </a>
              </div>
            </div>
            <div className="col-12 col-md-5 col-lg-4 offset-md-1">
              <div className="row position-relative" id="propertySlideImagesDesktop">
                <div className="swiper property-swiper-images swiper-initialized swiper-horizontal swiper-pointer-events" id="propertySlideImages">
                  <div className="swiper-wrapper" id="swiper-wrapper-14ac4a294c4d215a" aria-live="polite" style={{ transitionDuration: "0ms", transform: "translate3d(-869px, 0px, 0px)" }}><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" style={{ width: "419.5px", marginRight: "15px" }} role="group" aria-label="2 / 3">
                    <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/camera_8-1920x1281.jpg)" }}>
                      <a href="https://www.santateclaliving.com/?post_type=apartment&amp;p=4637" className="property-hidden-link">
                        <span className="sr-only">Bourgie</span>
                      </a>
                      <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_4-1920x1281.jpg)" }}>
                      </div>
                    </div>
                  </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-prev" data-swiper-slide-index="2" style={{ width: "419.5px", marginRight: "15px" }} role="group" aria-label="3 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/soggiorno_2-1-1920x1281.jpg)" }}>
                        <a href="https://www.santateclaliving.com/apartments/castore/" className="property-hidden-link">
                          <span className="sr-only">Castore</span>
                        </a>
                        <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/camera1_4-1920x1281.jpg)" }}>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-active" data-swiper-slide-index="0" style={{ width: "419.5px", marginRight: "15px" }} role="group" aria-label="1 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_5-1-1920x1281.jpg)" }}>
                        <a href="https://www.santateclaliving.com/apartments/nabila/" className="property-hidden-link">
                          <span className="sr-only">Nabila</span>
                        </a>
                        <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_1-1-1920x1281.jpg)" }}>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-next" data-swiper-slide-index="1" style={{ width: "419.5px", marginRight: "15px" }} role="group" aria-label="2 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/camera_8-1920x1281.jpg)" }}>
                        <a href="https://www.santateclaliving.com/?post_type=apartment&amp;p=4637" className="property-hidden-link">
                          <span className="sr-only">Bourgie</span>
                        </a>
                        <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_4-1920x1281.jpg)" }}>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-duplicate-prev" data-swiper-slide-index="2" style={{ width: "419.5px", marginRight: "15px" }} role="group" aria-label="3 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/soggiorno_2-1-1920x1281.jpg)" }}>
                        <a href="https://www.santateclaliving.com/apartments/castore/" className="property-hidden-link">
                          <span className="sr-only">Castore</span>
                        </a>
                        <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/camera1_4-1920x1281.jpg)" }}>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" data-swiper-slide-index="0" style={{ width: "419.5px", marginRight: "15px" }} role="group" aria-label="1 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_5-1-1920x1281.jpg)" }}>
                        <a href="https://www.santateclaliving.com/apartments/nabila/" className="property-hidden-link">
                          <span className="sr-only">Nabila</span>
                        </a>
                        <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_1-1-1920x1281.jpg)" }}>
                        </div>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" role="group" aria-label="2 / 3" style={{ width: "419.5px", marginRight: "15px" }}>
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/camera_8-1920x1281.jpg)" }}>
                        <a href="https://www.santateclaliving.com/?post_type=apartment&amp;p=4637" className="property-hidden-link">
                          <span className="sr-only">Bourgie</span>
                        </a>
                        <div className="swiper-switch-img position-absolute set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/02/soggiorno_4-1920x1281.jpg)" }}>
                        </div>
                      </div>
                    </div></div>
                  <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <script>
      var propertySwiperImages = null;
      var propertySwiper = null;

      function sliderBtnVerticalPositionIfDefined() {
        if (window.sliderBtnVerticalPosition) {
          if (window.innerWidth >= 768) {
            var propsSlideImage = $('.property-swiper-images .swiper-switch-main-img');
            var propsSlideTextWrapper = $('.property-swiper .swiper-slide');
            var propsSlideMainTitle = $('.main-title-for-slider');
            var propsSlideCta = $('.swiper-cta');
            window.sliderBtnVerticalPosition(propsSlideImage, propsSlideTextWrapper, propsSlideMainTitle, propsSlideCta);
          }
        } else {
          setTimeout(sliderBtnVerticalPositionIfDefined, 500);
        }
      }

      window.addEventListener('load', function () {

        if (global_x < 768) {
            propertySwiper = new Swiper(".property-swiper", {
              simulateTouch: false,
              allowTouchMove: false,
              effect: "fade",
              loop: true,
              breakpoints: {
                0: {
                  autoHeight: true,
                  slidesPerView: 1,
                },
                768: {
                  autoHeight: false,
                },
                992: {
                  slidesPerView: 2,
                },
              },
              on: {
                afterInit: function (swiper1) {
                  propertySwiper = swiper1;

                  propertySwiperImages = new Swiper(".property-swiper-images", {
                    spaceBetween: 15,
                    navigation: {
                      nextEl: ".pos-nav-change-first-slider .swiper-button-next",
                      prevEl: ".pos-nav-change-first-slider .swiper-button-prev",
                    },
                    loop: true,
                    breakpoints: {
                      0: {
                        autoHeight: true,
                        slidesPerView: 1,
                      },
                      768: {
                        autoHeight: false,
                      },
                      992: {
                        slidesPerView: 2,
                      },
                    },

                    on: {
                      slideChange: function (e) {
                        propertySwiper.slideTo(e.activeIndex);
                      },
                      afterInit: function () {
                        propertySwiperImages = e;
                        sliderBtnVerticalPositionIfDefined();
                      },
                    },
                  });
                }
              }
            });
        } else {
            propertySwiperImages = new Swiper(".property-swiper-images", {
              spaceBetween: 15,
              simulateTouch: false,
              allowTouchMove: false,
              loop: true,
              breakpoints: {
                0: {
                  autoHeight: true,
                  slidesPerView: 1,
                },
                768: {
                  autoHeight: false,
                },
                992: {
                  slidesPerView: 2,
                },
              },
              on: {
                afterInit: function (swiper1) {
                  propertySwiperImages = swiper1;

                  propertySwiper = new Swiper(".property-swiper", {
                    navigation: {
                      nextEl: ".pos-nav-change-first-slider .swiper-button-next",
                      prevEl: ".pos-nav-change-first-slider .swiper-button-prev",
                    },
                    effect: "fade",
                    loop: true,
                    breakpoints: {
                      0: {
                        autoHeight: true,
                        slidesPerView: 1,
                      },
                      768: {
                        autoHeight: false,
                      },
                      992: {
                        slidesPerView: 2,
                      },
                    },

                    on: {
                      slideChange: function (e) {
                        propertySwiperImages.slideTo(e.activeIndex);
                      },
                      afterInit: function () {
                        propertySwiper = e;
                        sliderBtnVerticalPositionIfDefined();
                      },
                    },
                  });
                }
              }
            });
        }
      });
        </script> */}
      <section className="row d-flex padding-y-60-60 swiper-fp-service-wrap">
        <div className="container">
          <h2 className="mb-0 padding-y-0-80 ff-sans fw-400 fz-32 color-black lh-xs">
            Servizi extra on demand          </h2>
          <div className="swiper swiper-fp-service pb-5 swiper-initialized swiper-horizontal swiper-pointer-events">
            <div className="swiper-wrapper" id="swiper-wrapper-151b7746c2356bf4" aria-live="polite" style={{ transform: "translate3d(0px, 0px, 0px)" }}>


              <div className="swiper-slide d-flex swiper-slide-active" style={{ width: "460px", marginRight: "30px" }} role="group" aria-label="1 / 6">
                <div className="d-inline-flex flex-column mx-auto">
                  <figure className="d-inline-block fp-services-icon">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/icon-babysitter.png" alt="" className="img-fluid lazy" />
                  </figure>
                  <span className="ff-sans fw-500 color-black fz-24 lh-sm">
                    Baby Sitter                    </span>
                </div>
              </div>

              <div className="swiper-slide d-flex swiper-slide-next" style={{ width: "460px", marginRight: "30px" }} role="group" aria-label="2 / 6">
                <div className="d-inline-flex flex-column mx-auto">
                  <figure className="d-inline-block fp-services-icon">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/icon-beauty.png" alt="" className="img-fluid lazy" />
                  </figure>
                  <span className="ff-sans fw-500 color-black fz-24 lh-sm">
                    Beauty center                    </span>
                </div>
              </div>

              <div className="swiper-slide d-flex" style={{ width: "460px", marginRight: "30px" }} role="group" aria-label="3 / 6">
                <div className="d-inline-flex flex-column mx-auto">
                  <figure className="d-inline-block fp-services-icon">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/icon-chef.png" alt="" className="img-fluid lazy" />
                  </figure>
                  <span className="ff-sans fw-500 color-black fz-24 lh-sm">
                    Chef a domicilio                    </span>
                </div>
              </div>

              <div className="swiper-slide d-flex" style={{ width: "460px", marginRight: "30px" }} role="group" aria-label="4 / 6">
                <div className="d-inline-flex flex-column mx-auto">
                  <figure className="d-inline-block fp-services-icon">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/icon-gym.png" alt="" className="img-fluid lazy" />
                  </figure>
                  <span className="ff-sans fw-500 color-black fz-24 lh-sm">
                    Palestra                    </span>
                </div>
              </div>

              <div className="swiper-slide d-flex" style={{ width: "460px", marginRight: "30px" }} role="group" aria-label="5 / 6">
                <div className="d-inline-flex flex-column mx-auto">
                  <figure className="d-inline-block fp-services-icon">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/icon-parking-1.png" alt="" className="img-fluid lazy" />
                  </figure>
                  <span className="ff-sans fw-500 color-black fz-24 lh-sm">
                    Parcheggio                    </span>
                </div>
              </div>

              <div className="swiper-slide d-flex" style={{ width: "460px", marginRight: "30px" }} role="group" aria-label="6 / 6">
                <div className="d-inline-flex flex-column mx-auto">
                  <figure className="d-inline-block fp-services-icon">
                    <img data-src="https://www.santateclaliving.com/wp-content/uploads/2023/02/icon-transfer-1.png" alt="" className="img-fluid lazy" />
                  </figure>
                  <span className="ff-sans fw-500 color-black fz-24 lh-sm">
                    Transfer                    </span>
                </div>
              </div>
            </div>
            <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"><span className="swiper-pagination-bullet swiper-pagination-bullet-active" tabIndex={0} role="button" aria-label="Go to slide 1" aria-current="true"></span><span className="swiper-pagination-bullet" tabIndex={0} role="button" aria-label="Go to slide 2"></span></div>
            <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>

        </div>

      </section>

      {/* <script>
                    var swiperSellLg = new Swiper(".swiper-fp-service", {
                      slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                    pagination: {
                      el: ".swiper-fp-service .swiper-pagination",
                    clickable: true,
        },

                    breakpoints: {
                      0: {
                      slidesPerGroup: 1,
                    slidesPerView: 1,
          },
                    576: {
                      slidesPerGroup: 2,
                    slidesPerView: 2,
          },
                    768: {
                      slidesPerGroup: 3,
                    slidesPerView: 3,
          },
        },
      });
                  </script> */}

      <section id="slider-invertito" className="row padding-y-90-120 overflow-hidden design-team-wrapper">

        <div className="container">
          <div className="row">

            <div className="col-12 col-md-5 col-lg-6">

              <div className="row position-relative" id="teamsSlideImagesDesktop">
                <div dir="rtl" className="swiper team-swiper-images swiper-initialized swiper-horizontal swiper-pointer-events swiper-rtl" id="teamsSlideImages">
                  <div className="swiper-wrapper" id="swiper-wrapper-57b6a651edc5b3f6" aria-live="polite" style={{ transitionDuration: "0ms", transform: "translate3d(869px, 0px, 0px)" }}><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" style={{ width: "419.5px", marginLeft: "15px" }} role="group" aria-label="2 / 3">
                    <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg)" }}>
                    </div>
                  </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-prev" data-swiper-slide-index="2" style={{ width: "419.5px", marginLeft: "15px" }} role="group" aria-label="3 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_214367292-1920x2410.jpeg)" }}>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-active" data-swiper-slide-index="0" style={{ width: "419.5px", marginLeft: "15px" }} role="group" aria-label="1 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_242806454-1920x1280.jpeg)" }}>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-next" data-swiper-slide-index="1" style={{ width: "419.5px", marginLeft: "15px" }} role="group" aria-label="2 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg)" }}>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-duplicate-prev" data-swiper-slide-index="2" style={{ width: "419.5px", marginLeft: "15px" }} role="group" aria-label="3 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_214367292-1920x2410.jpeg)" }}>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" data-swiper-slide-index="0" style={{ width: "419.5px", marginLeft: "15px" }} role="group" aria-label="1 / 3">
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_242806454-1920x1280.jpeg)" }}>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" role="group" aria-label="2 / 3" style={{ width: "419.5px", marginLeft: "15px" }}>
                      <div className="switch-img-wrap swiper-switch-main-img set-background-img" style={{ backgroundImage: "url(https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg)" }}>
                      </div>
                    </div></div>
                  <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
              </div>
            </div>

            <div className="d-flex flex-column justify-content-between slider-col-txt">
              <div className="position-relative team-wrapper">
                <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                  Esperienze a Milano              </h2>
                <div id="teamsSlideImagesMobile"></div>

                <div className="swiper-button-wrap pos-nav-change-first-slider">
                  <div className="swiper-button-prev btn-only-arrow only-arrow-black" tabIndex={0} role="button" aria-label="Previous slide" aria-controls="swiper-wrapper-15582dbeb6117d6f">
                    <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 27 27" xmlSpace="preserve"><path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path></svg>                  </div>
                  </div>
                  <div className="swiper-button-next btn-only-arrow only-arrow-black" tabIndex={0} role="button" aria-label="Next slide" aria-controls="swiper-wrapper-15582dbeb6117d6f">
                    <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 27 27" xmlSpace="preserve"><path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path></svg>                  </div>
                  </div>
                </div>

                <div className="swiper team-swiper swiper-fade swiper-initialized swiper-horizontal swiper-pointer-events">
                  <div className="swiper-wrapper" id="swiper-wrapper-15582dbeb6117d6f" aria-live="polite" style={{ transitionDuration: "0ms" }}><div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 1, transform: "translate3d(0px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="2 / 3">
                    <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                        Cena sul tram                          </p>
                    </div>
                    <div className="w-100 position-relative">
                      <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                        <p>Per trascorrere una serata indimenticabile nella nostra bellissima Milano, ecco a voi la cena romantica per eccellenza a bordo di un tram storico. Mentre godete della cena in tranquillità, fuori dal finestrino scorrono i luoghi più iconici della città, da Piazza Castello, al Duomo fino alla Darsena.</p>
                      </div>
                    </div>
                  </div><div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-prev" data-swiper-slide-index="2" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 1, transform: "translate3d(-292px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="3 / 3">
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Giro in 500 d'epoca                          </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>Vuoi visitare Milano da un punto di vista unico e in vero stile italiano? Visita la città a bordo di una Fiat 500 vintage restaurata! Ammirate la città dal finestrino di un’auto iconica e dal fascino irresistibile come dei veri local. Non perderti questa esperienza urbana da ricordare.</p>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-visible swiper-slide-active" data-swiper-slide-index="0" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 1, transform: "translate3d(-583px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="1 / 3">
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Tramonto sulla cima del Duomo                          </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>Ammira lo skyline di Milano da un punto di vista eccezionale. Prenotando il biglietto per la terrazza Duomo all’ora del tramonto, potrai goderti lo spettacolo unico del sole che cala fra le guglie. Non perderti questa esperienza indimenticabile.</p>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-visible swiper-slide-next" data-swiper-slide-index="1" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-875px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="2 / 3">
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Cena sul tram                          </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>Per trascorrere una serata indimenticabile nella nostra bellissima Milano, ecco a voi la cena romantica per eccellenza a bordo di un tram storico. Mentre godete della cena in tranquillità, fuori dal finestrino scorrono i luoghi più iconici della città, da Piazza Castello, al Duomo fino alla Darsena.</p>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-duplicate-prev" data-swiper-slide-index="2" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-1166px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="3 / 3">
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Giro in 500 d'epoca                          </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>Vuoi visitare Milano da un punto di vista unico e in vero stile italiano? Visita la città a bordo di una Fiat 500 vintage restaurata! Ammirate la città dal finestrino di un’auto iconica e dal fascino irresistibile come dei veri local. Non perderti questa esperienza urbana da ricordare.</p>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-active" data-swiper-slide-index="0" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-1458px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="1 / 3">
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Tramonto sulla cima del Duomo                          </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>Ammira lo skyline di Milano da un punto di vista eccezionale. Prenotando il biglietto per la terrazza Duomo all’ora del tramonto, potrai goderti lo spettacolo unico del sole che cala fra le guglie. Non perderti questa esperienza indimenticabile.</p>
                        </div>
                      </div>
                    </div><div className="swiper-slide pl-1 swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="1" style={{ width: "291.5px", transitionDuration: "0ms", opacity: 0, transform: "translate3d(-1749px, 0px, 0px)", minHeight: "471.333px" }} role="group" aria-label="2 / 3">
                      <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                        <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                          Cena sul tram                          </p>
                      </div>
                      <div className="w-100 position-relative">
                        <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                          <p>Per trascorrere una serata indimenticabile nella nostra bellissima Milano, ecco a voi la cena romantica per eccellenza a bordo di un tram storico. Mentre godete della cena in tranquillità, fuori dal finestrino scorrono i luoghi più iconici della città, da Piazza Castello, al Duomo fino alla Darsena.</p>
                        </div>
                      </div>
                    </div></div>
                  <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
              </div>
            </div>

          </div>
        </div>

      </section>
      <script>
        {/* var teamsSwiperImages = null;
            var teamsSwiper = null;

            function teamSliderBtnVerticalPositionIfDefined() {
              if (window.sliderBtnVerticalPosition) {
                if (window.innerWidth >= 768) {
                  var teamSlideImage = $('.team-swiper-images .swiper-switch-main-img');
                  var teamSlideTextWrapper = $('.team-swiper .swiper-slide');
                  var teamsSlideMainTitle = $('.team-wrapper .main-title-for-slider');
                  window.sliderBtnVerticalPosition(teamSlideImage, teamSlideTextWrapper, teamsSlideMainTitle);
                }
              } else {
                    setTimeout(teamSliderBtnVerticalPositionIfDefined, 500);
              }
            }

            window.addEventListener('load', function () {

            if (global_x < 768) {
                  teamsSwiper = new Swiper(".team-swiper", {
                    simulateTouch: false,
                    allowTouchMove: false,
                    effect: "fade",
                    loop: true,
                    breakpoints: {
                      0: {
                        autoHeight: true,
                        slidesPerView: 1,
                      },
                      768: {
                        autoHeight: false,
                      },
                      992: {
                        slidesPerView: 2,
                      },
                    },
                    on: {
                      afterInit: function (swiper2) {
                        teamsSwiper = swiper2;

                        teamsSwiperImages = new Swiper(".team-swiper-images", {
                          navigation: {
                            nextEl: ".pos-nav-change-first-slider .swiper-button-next",
                            prevEl: ".pos-nav-change-first-slider .swiper-button-prev",
                          },
                          spaceBetween: 15,
                          loop: true,
                          breakpoints: {
                            0: {
                              autoHeight: true,
                              slidesPerView: 1,
                            },
                            768: {
                              autoHeight: false,
                            },
                            992: {
                              slidesPerView: 2,
                            },
                          },

                          on: {
                            slideChange: function (e) {
                              teamsSwiper.slideTo(e.activeIndex);
                            },
                            afterInit: function () {
                              teamsSwiperImages = e;
                              teamSliderBtnVerticalPositionIfDefined();
                            },
                          },
                        });
                      }
                    }
                  });
            } else {
                  teamsSwiperImages = new Swiper(".team-swiper-images", {
                    spaceBetween: 15,
                    simulateTouch: false,
                    allowTouchMove: false,
                    loop: true,
                    breakpoints: {
                      0: {
                        autoHeight: true,
                        slidesPerView: 1,
                      },
                      768: {
                        autoHeight: false,
                      },
                      992: {
                        slidesPerView: 2,
                      },
                    },
                    on: {
                      afterInit: function (swiper2) {
                        teamsSwiperImages = swiper2;

                        teamsSwiper = new Swiper(".team-swiper", {
                          navigation: {
                            nextEl: ".pos-nav-change-first-slider .swiper-button-next",
                            prevEl: ".pos-nav-change-first-slider .swiper-button-prev",
                          },
                          effect: "fade",
                          loop: true,
                          breakpoints: {
                            0: {
                              autoHeight: true,
                              slidesPerView: 1,
                            },
                            768: {
                              autoHeight: false,
                            },
                            992: {
                              slidesPerView: 2,
                            },
                          },

                          on: {
                            slideChange: function (e) {
                              teamsSwiperImages.slideTo(e.activeIndex);
                            },
                            afterInit: function () {
                              teamsSwiper = e;
                              teamSliderBtnVerticalPositionIfDefined();
                            },
                          },
                        });
                      }
                    }
                  });
            }
          }); */}

      </script>

      <div className="row living-banner-book d-flex flex-column">
        <div className="collapse" id="collapseBannerBook">
          <div className="container padding-y-30-30">
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-9 col-xl-6 mb-4">
                <div className="site-content fz-20 text-center">
                  <p>Verifica le disponibilità e scopri i vantaggi della prenotazione diretta.</p>
                  <p className="mt-0 fw-500">Mandaci la tua richiesta!</p>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
                <a href="tel:+393519361241" className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline">
                  <span className="">Chiamaci</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chiama-tel fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chiama-tel fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>
              <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
                <a href="https://wa.me/+393519361241" target="_blank" rel="nofollow noopener" className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline">
                  <span className="">Contattaci</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chat-wa fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chat-wa fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>
              <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
                <a href="mailto:reservation@santateclaliving.com" className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline">
                  <span>Mail</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chiedi-info fz-28 color-black"></i>
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chiedi-info fz-28 color-white"></i>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
