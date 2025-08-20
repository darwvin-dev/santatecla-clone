"use client";

import type { FC, CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import { Apartment } from "@/types/Apartment";

type Props = { apartments: Apartment[] };

const imgMainStyle: CSSProperties = {
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  position: "relative",
  height: "100%",
  minHeight: "300px",
};

const imgOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 12,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const BREAKPOINT_MD = 992;

const ApartmentsSection: FC<Props> = ({ apartments }) => {
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);
  const [spvImages, setSpvImages] = useState<number>(1);

  const items = useMemo(() => apartments || [], [apartments]);
  if (!items.length) return null;

  useEffect(() => {
    const calc = () => {
      const isMdUp = typeof window !== "undefined" && window.innerWidth >= BREAKPOINT_MD;
      setSpvImages(isMdUp ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const canLoop = items.length > spvImages;
  const canSlide = canLoop; // اگه نتونه اسلایدِ تصاویر حرکت کنه، دکمه‌ها رو هم غیرفعال کن
  const isReady = !!(textSwiper && imageSwiper);

  const gotoIndex = (idx: number) => {
    if (textSwiper) {
      if (canLoop) textSwiper.slideToLoop(idx);
      else textSwiper.slideTo(idx);
    }
    if (imageSwiper) {
      if (canLoop) imageSwiper.slideToLoop(idx);
      else imageSwiper.slideTo(idx);
    }
  };

  const syncTo = (idx: number) => {
    if (textSwiper && textSwiper.realIndex !== idx) {
      if (canLoop) textSwiper.slideToLoop(idx);
      else textSwiper.slideTo(idx);
    }
    if (imageSwiper && imageSwiper.realIndex !== idx) {
      if (canLoop) imageSwiper.slideToLoop(idx);
      else imageSwiper.slideTo(idx);
    }
  };

  // ناوبری دکمه‌ها
  const go = (dir: 1 | -1) => {
    if (!canSlide || !isReady) return;
    const base = imageSwiper ?? textSwiper!;
    const len = items.length;
    const next = (base.realIndex + dir + len) % len;
    gotoIndex(next);
  };

  const handlePrev = () => go(-1);
  const handleNext = () => go(1);

  const keyActivate =
    (fn: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };

  return (
    <section className="row padding-y-90-90 overflow-hidden prop-section-immobile">
      <div className="container">
        <div className="row flex-nowrap">
          {/* ستون متن + ناوبری */}
          <div className="d-flex flex-column justify-content-between slider-col-txt">
            <div>
              <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                I nostri appartamenti
              </h2>

              <div id="propertySlideImagesMobile" />

              <div
                className="swiper-button-wrap pos-nav-change-first-slider"
                style={{ display: "flex", gap: 8 }}
              >
                <button
                  type="button"
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  aria-label="Previous slide"
                  onClick={handlePrev}
                  onKeyDown={keyActivate(handlePrev)}
                  disabled={!canSlide || !isReady}
                  aria-disabled={!canSlide || !isReady}
                  style={{
                    cursor: canSlide && isReady ? "pointer" : "not-allowed",
                    opacity: canSlide && isReady ? 1 : 0.5,
                    position: "relative",
                    zIndex: 10,
                  }}
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
                  disabled={!canSlide || !isReady}
                  aria-disabled={!canSlide || !isReady}
                  style={{
                    cursor: canSlide && isReady ? "pointer" : "not-allowed",
                    opacity: canSlide && isReady ? 1 : 0.5,
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27" aria-hidden="true">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                    </svg>
                  </div>
                </button>
              </div>

              {/* اسلایدر متن (follower) */}
              <Swiper
                modules={[EffectFade]}
                className="property-swiper"
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={canLoop}
                rewind={!canLoop}
                onSwiper={setTextSwiper}
                onSlideChange={(sw) => syncTo(sw.realIndex)}
                allowTouchMove={canSlide}
                watchOverflow
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

          {/* ستون تصاویر (master) */}
          <div className="offset-md-1 gallery-single-prop position-relative w-125">
            <div
              className="row gallery-prop-wrap"
              id="propertySlideImagesDesktop"
              style={{ height: "clamp(320px, 68vh, 720px)" }}
            >
              <Swiper
                id="propertySlideImages"
                className="property-swiper-images"
                loop={canLoop}
                rewind={!canLoop}
                spaceBetween={15}
                onSwiper={setImageSwiper}
                onSlideChange={(sw) => syncTo(sw.realIndex)}
                style={{ height: "100%" }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  992: { slidesPerView: 2 },
                }}
                allowTouchMove={canSlide}
                watchOverflow
              >
                {items.map((ap) => {
                  const href = `/apartments/${ap.title}`;
                  const main = ap.image;
                  const overlay =
                    (Array.isArray((ap as any).gallery) && (ap as any).gallery[0]) || ap.image;

                  return (
                    <SwiperSlide key={ap._id} style={{ height: "100%" }}>
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img card-img"
                        style={{
                          ...imgMainStyle,
                          backgroundImage: `url(${main})`,
                        }}
                      >
                        <a href={href} className="property-hidden-link">
                          <span className="sr-only">{ap.title}</span>
                        </a>
                        <div
                          className="swiper-switch-img position-absolute set-background-img card-img-overlay"
                          style={{
                            ...imgOverlayStyle,
                            backgroundImage: `url(${overlay})`,
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
