"use client";

import type { FC, CSSProperties } from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Controller, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Apartment } from "@/types/Apartment";
import { resolveUrl } from "@/lib/helper";
import { Link } from "@/i18n/navigation";

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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const items = useMemo(() => apartments || [], [apartments]);
  if (!items.length) return null;

  const slidesPerView = isDesktop ? 2 : 1;
  const loopEnabled = items.length > slidesPerView;
  const canSlide = items.length > 1;

  useEffect(() => {
    if (imageSwiper && textSwiper) {
      imageSwiper.controller.control = textSwiper;
      textSwiper.controller.control = null as any;

      const idx = 0;
      if (loopEnabled) {
        imageSwiper.slideToLoop(idx, 0);
        textSwiper.slideToLoop(idx, 0);
      } else {
        imageSwiper.slideTo(idx, 0);
        textSwiper.slideTo(idx, 0);
      }
      setActiveIndex(idx);
    }
  }, [imageSwiper, textSwiper, loopEnabled]);

  const onImageChanged = useCallback(
    (swiper: SwiperType) => {
      const idx = swiper.realIndex ?? swiper.activeIndex ?? 0;
      setActiveIndex(idx);
      if (textSwiper) {
        if (loopEnabled) textSwiper.slideToLoop(idx, 300);
        else textSwiper.slideTo(idx, 300);
      }
    },
    [textSwiper, loopEnabled]
  );

  const handlePrev = useCallback(() => {
    if (!canSlide) return;
    imageSwiper?.slidePrev();
  }, [canSlide, imageSwiper]);

  const handleNext = useCallback(() => {
    if (!canSlide) return;
    imageSwiper?.slideNext();
  }, [canSlide, imageSwiper]);

  const syncTo = useCallback(
    (idx: number) => {
      if (!canSlide || !imageSwiper) return;
      if (loopEnabled) imageSwiper.slideToLoop(idx, 300);
      else imageSwiper.slideTo(idx, 300);
      setActiveIndex(idx);
    },
    [canSlide, imageSwiper, loopEnabled]
  );

  const keyActivate = useCallback(
    (fn: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    },
    []
  );

  return (
    <section className="row padding-y-90-90 overflow-hidden prop-section-immobile">
      <div className="container">
        <div className="row flex-nowrap">
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
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg
                      viewBox="0 0 27 27"
                      width="27"
                      height="27"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <g transform="translate(27,0) scale(-1,1)">
                        <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                      </g>
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

              <Swiper
                modules={[EffectFade, Controller]}
                className="property-swiper"
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={loopEnabled}
                allowTouchMove={false}
                onSwiper={setTextSwiper}
                observer
                observeParents
                resizeObserver
              >
                {items.map((ap, index) => (
                  <SwiperSlide key={ap._id ?? `txt-${index}`} className="pl-1">
                    <div className="pt-1 pt-md-0 w-100 position-relative">
                      <a
                        href={`/apartments/${encodeURIComponent(ap.title)}`}
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
              <Link
                href="/apartments"
                className="d-inline-flex align-items-center btn-rounded btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline text-center"
              >
                <span>Vedi tutti</span>
              </Link>
            </div>
          </div>

          {/* تصاویر (مستر) */}
          <div className="offset-md-1 gallery-single-prop position-relative w-125">
            <div
              className="row gallery-prop-wrap"
              id="propertySlideImagesDesktop"
              style={{ height: "clamp(320px, 68vh, 720px)" }}
            >
              <Swiper
                id="propertySlideImages"
                modules={[Controller]}
                className="property-swiper-images apartment-section-swiper"
                loop={loopEnabled}
                spaceBetween={15}
                slidesPerView={slidesPerView}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  992: { slidesPerView: 2 },
                }}
                onSwiper={setImageSwiper}
                onSlideChange={onImageChanged}
                style={{ height: "100%" }}
                watchSlidesProgress
                observer
                observeParents
                resizeObserver
              >
                {items.map((ap, index) => {
                  const href = `/apartments/${encodeURIComponent(ap.title)}`;
                  const mainRaw = ap.image || "/fallback-image.jpg";
                  const gallery = (ap as any).gallery || [];
                  const overlayRaw = gallery[0] || mainRaw;

                  const mainUrl = resolveUrl(mainRaw);
                  const overlayUrl = resolveUrl(overlayRaw);

                  return (
                    <SwiperSlide
                      key={ap._id ?? `img-${index}`}
                      style={{ height: "100%" }}
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img card-img"
                        style={{
                          ...imgMainStyle,
                          backgroundImage: `url(${mainUrl})`,
                        }}
                      >
                        <Link href={href} className="property-hidden-link">
                          <span className="sr-only">{ap.title}</span>
                        </Link>
                        <div
                          className="swiper-switch-img swiper-overlay-img position-absolute set-background-img card-img-overlay"
                          style={{
                            ...imgOverlayStyle,
                            backgroundImage: `url(${overlayUrl})`,
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
        .swiper-switch-main-img,
        .swiper-switch-img {
          background-size: cover !important;
          background-position: center !important;
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
        .property-swiper-images,
        .property-swiper-images .swiper-wrapper,
        .property-swiper-images .swiper-slide {
          height: 100% !important;
        }

        #propertySlideImagesDesktop {
          height: clamp(320px, 68vh, 720px);
        }

        @media (max-width: 991px) {
          #propertySlideImagesDesktop {
            height: clamp(260px, 56vh, 520px) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ApartmentsSection;
