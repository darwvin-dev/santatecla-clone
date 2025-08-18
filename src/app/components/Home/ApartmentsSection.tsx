"use client";

import type { FC } from "react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { Controller, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

export type Apartment = {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  image: string;
};

type Props = { apartments: Apartment[] };

const ApartmentsSection: FC<Props> = ({ apartments }) => {
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);

  if (!apartments?.length) return null;

  return (
    <section className="row padding-y-90-90 overflow-hidden prop-section-immobile">
      <div className="container">
        <div className="row">
          <div className="d-flex flex-column justify-content-between slider-col-txt">
            <div>
              <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                I nostri appartamenti
              </h2>

              {/* دکمه‌های ناوبری */}
              <div className="swiper-button-wrap pos-nav-change-first-slider">
                <button
                  type="button"
                  className="swiper-button-prev btn-only-arrow only-arrow-black js-apts-prev"
                  aria-label="Previous slide"
                >
                  <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                    </svg>
                  </div>
                </button>
                <button
                  type="button"
                  className="swiper-button-next btn-only-arrow only-arrow-black js-apts-next"
                  aria-label="Next slide"
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                    </svg>
                  </div>
                </button>
              </div>

              {/* اسلایدر متن */}
              <Swiper
                modules={[EffectFade, Controller, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                onSwiper={setTextSwiper}
                controller={{ control: imageSwiper as any }}
                navigation={{ prevEl: ".js-apts-prev", nextEl: ".js-apts-next" }}
                className="property-swiper"
              >
                {apartments.map((ap) => (
                  <SwiperSlide key={ap.id}>
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

          {/* ستون تصاویر: هر اسلاید = تصویر فعلی + تصویر آپارتمان قبلی کنار هم */}
          <div className="col-12 col-md-5 col-lg-4 offset-md-1">
            <div className="row position-relative">
              <Swiper
                modules={[Controller]}
                loop
                onSwiper={setImageSwiper}
                controller={{ control: textSwiper as any }}
                className="property-swiper-images"
              >
                {apartments.map((ap, idx) => {
                  const prevIdx = (idx - 1 + apartments.length) % apartments.length;
                  const prev = apartments[prevIdx];

                  return (
                    <SwiperSlide key={ap.id}>
                      <div
                        className="d-flex"
                        style={{ gap: 12, width: "100%" }}
                      >
                        {/* قبلی */}
                        <a
                          href={`/apartments/${prev.slug}`}
                          className="property-hidden-link"
                          aria-label={`Previous: ${prev.title}`}
                          style={{
                            display: "block",
                            width: "50%",
                            position: "relative",
                            borderRadius: 12,
                            overflow: "hidden",
                            backgroundImage: `url(${prev.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            aspectRatio: "4 / 3",
                          }}
                        />
                        {/* فعلی */}
                        <a
                          href={`/apartments/${ap.slug}`}
                          className="property-hidden-link"
                          aria-label={ap.title}
                          style={{
                            display: "block",
                            width: "50%",
                            position: "relative",
                            borderRadius: 12,
                            overflow: "hidden",
                            backgroundImage: `url(${ap.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            aspectRatio: "4 / 3",
                          }}
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
