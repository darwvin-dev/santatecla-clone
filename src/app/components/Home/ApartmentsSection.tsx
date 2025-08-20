"use client";

import type { FC, CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Controller, EffectFade } from "swiper/modules";

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

const ApartmentsSection: FC<Props> = ({ apartments }) => {
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
    if (!canSlide) return;
    textSwiper?.slidePrev();
    imageSwiper?.slidePrev();
  };

  const handleNext = () => {
    if (!canSlide) return;
    textSwiper?.slideNext();
    imageSwiper?.slideNext();
  };

  const syncTo = (idx: number) => {
    textSwiper?.slideTo(idx);
    imageSwiper?.slideTo(idx);
    setActiveIndex(idx);
  };

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

              <div
                className="swiper-button-wrap pos-nav-change-first-slider"
                style={{ display: "flex", gap: 8, marginBottom: "1rem" }}
              >
                <button
                  type="button"
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  aria-label="Previous slide"
                  onClick={handlePrev}
                  onKeyDown={keyActivate(handlePrev)}
                  disabled={!canSlide}
                  style={{
                    cursor: canSlide ? "pointer" : "not-allowed",
                    opacity: canSlide ? 1 : 0.5,
                  }}
                >
                  <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                    <svg
                      viewBox="0 0 27 27"
                      width="27"
                      height="27"
                      aria-hidden="true"
                    >
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
                  style={{
                    cursor: canSlide ? "pointer" : "not-allowed",
                    opacity: canSlide ? 1 : 0.5,
                  }}
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg
                      viewBox="0 0 27 27"
                      width="27"
                      height="27"
                      aria-hidden="true"
                    >
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
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                controller={{ control: imageSwiper }}
                allowTouchMove={false}
              >
                {items.map((ap, index) => (
                  <SwiperSlide key={ap._id || index} className="pl-1">
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

              {/* نشانگرهای پیمایش */}
              {canSlide && (
                <div className="swiper-pagination-custom">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`swiper-pagination-bullet ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => syncTo(index)}
                      aria-label={`Vai al slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
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
          <div className="offset-md-1 gallery-single-prop position-relative w-125">
            <div
              className="row gallery-prop-wrap"
              id="propertySlideImagesDesktop"
              style={{ height: "clamp(320px, 68vh, 720px)" }}
            >
              <Swiper
                id="propertySlideImages"
                modules={[Controller]}
                className="property-swiper-images"
                loop={canSlide}
                spaceBetween={15}
                onSwiper={setImageSwiper}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                controller={{ control: textSwiper }}
                style={{ height: "100%" }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  992: { slidesPerView: 2 },
                }}
              >
                {items.map((ap, index) => {
                  const href = `/apartments/${ap.title}`;
                  const main = ap.image;
                  const gallery = (ap as any).gallery || [];
                  const overlay = gallery[0] || ap.image;

                  return (
                    <SwiperSlide key={ap._id || index} style={{ height: "100%" }}>
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

      <style jsx>{`
        .swiper-pagination-custom {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 1rem;
        }
        
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ccc;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .swiper-pagination-bullet.active {
          background-color: #000;
        }
        
        .swiper-pagination-bullet:hover {
          background-color: #666;
        }
        
        .property-hidden-link {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }
        
        .card-img-overlay {
          z-index: 1;
          border-radius: 8px;
          transition: opacity 0.3s ease;
        }
        
        .card-img:hover .card-img-overlay {
          opacity: 0;
        }
        
        @media (max-width: 991px) {
          .slider-col-txt {
            order: 2;
          }
          
          .gallery-single-prop {
            order: 1;
            margin-bottom: 2rem;
          }
          
          .row.flex-nowrap {
            flex-wrap: wrap !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ApartmentsSection;