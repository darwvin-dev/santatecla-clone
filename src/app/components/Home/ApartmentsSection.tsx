"use client";

import type { FC, CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { Controller, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import { Apartment } from "@/types/Apartment";

type Props = { apartments: Apartment[] };

const imgMainStyle: CSSProperties = {
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  aspectRatio: "16 / 9",
};

const imgOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 12,
  borderRadius: 10,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const ApartmentsSection: FC<Props> = ({ apartments }) => {
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);

  const items = useMemo(() => apartments || [], [apartments]);
  if (!items.length) return null;

  useEffect(() => {
    if (textSwiper && imageSwiper) {
      textSwiper.controller.control = imageSwiper;
      imageSwiper.controller.control = textSwiper;
    }
  }, [textSwiper, imageSwiper]);

  const canSlide = items.length > 1;

  const handlePrev = () => {
    if (canSlide) textSwiper?.slidePrev();
  };
  const handleNext = () => {
    if (canSlide) textSwiper?.slideNext();
  };
  const keyActivate =
    (fn: () => void) =>
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };

  return (
    <section className="row padding-y-90-90 overflow-hidden prop-section-immobile">
      <div className="container">
        <div className="row">
          {/* ستون متن + ناوبری */}
          <div className="d-flex flex-column justify-content-between slider-col-txt">
            <div>
              <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                I nostri appartamenti
              </h2>

              <div id="propertySlideImagesMobile" />

              <div className="swiper-button-wrap pos-nav-change-first-slider" style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  aria-label="Previous slide"
                  onClick={handlePrev}
                  onKeyDown={keyActivate(handlePrev)}
                  disabled={!canSlide}
                  style={{ cursor: canSlide ? "pointer" : "not-allowed", opacity: canSlide ? 1 : 0.5 }}
                >
                  <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27" aria-hidden="true">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                    </svg>
                  </div>
                </button>

                <button
                  type="button"
                  className="swiper-button-next btn-only-arrow only-arrow-black"
                  aria-label="Next slide"
                  onClick={handleNext}
                  onKeyDown={keyActivate(handleNext)}
                  disabled={!canSlide}
                  style={{ cursor: canSlide ? "pointer" : "not-allowed", opacity: canSlide ? 1 : 0.5 }}
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27" aria-hidden="true">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                    </svg>
                  </div>
                </button>
              </div>

              {/* اسلایدر متن */}
              <Swiper
                modules={[EffectFade, Controller]}
                className="property-swiper"
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={canSlide}
                onSwiper={setTextSwiper}
                controller={{ control: imageSwiper as any }}
              >
                {items.map((ap) => (
                  <SwiperSlide key={ap._id} className="pl-1">
                    <div className="pt-1 pt-md-0 w-100 position-relative">
                      <a
                        href={`/apartments/${ap.title}`}
                        className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline"
                      >
                        {ap.title}
                      </a>
                    </div>
                    <div className="w-100 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                        {ap.description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="swiper-cta">
              <a
                href="/apartments"
                className="d-inline-flex align-items-center btn-rounded btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline text-center"
              >
                <span>Vedi tutti</span>
              </a>
            </div>
          </div>

          {/* ستون تصاویر */}
          <div className="col-12 col-md-5 col-lg-4 offset-md-1">
            <div className="row position-relative" id="propertySlideImagesDesktop">
              <Swiper
                id="propertySlideImages"
                modules={[Controller]}
                className="property-swiper-images"
                loop={canSlide}
                spaceBetween={15}
                onSwiper={setImageSwiper}
                controller={{ control: textSwiper as any }}
              >
                {items.map((ap) => {
                  const href = `/apartments/${ap.title}`;
                  const mainUrl = ap.image;
                  const overlayUrl =
                    (Array.isArray((ap as any).gallery) && (ap as any).gallery[0]) || ap.image;

                  return (
                    <SwiperSlide key={ap._id}>
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img"
                        style={{ ...imgMainStyle, backgroundImage: `url(${mainUrl})` }}
                      >
                        <a href={href} className="property-hidden-link">
                          <span className="sr-only">{ap.title}</span>
                        </a>

                        <div
                          className="swiper-switch-img position-absolute set-background-img"
                          style={{ ...imgOverlayStyle, backgroundImage: `url(${overlayUrl})` }}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentsSection;
