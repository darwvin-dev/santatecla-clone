"use client";

import type { FC, CSSProperties } from "react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Controller, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Apartment } from "@/types/Apartment";
import { resolveUrl } from "@/lib/helper";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

type Props = { apartments: Apartment[] };

const imgMainStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: "300px",
  overflow: "hidden",
  borderRadius: 8,
};

const overlayContainerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  pointerEvents: "none", // so clicks go through to link
};

const overlayImgBase = {
  position: "absolute" as const,
  inset: 0,
  objectFit: "cover" as const,
  width: "100%",
  height: "100%",
};

const ApartmentsSection: FC<Props> = ({ apartments }) => {
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [touchOverlayIndex, setTouchOverlayIndex] = useState<number | null>(null);

  const t = useTranslations("homepage");
  const locale = useLocale();
  const mqRef = useRef<MediaQueryList | null>(null);

  const items = useMemo(() => {
    return (apartments || []).map((ap) => {
      const mainRaw = ap.image || "/fallback-image.jpg";
      const gallery: string[] = (ap as any).gallery || [];
      const overlayRaw = gallery[0] || mainRaw;

      return {
        ...ap,
        mainUrl: resolveUrl(mainRaw),
        overlayUrl: resolveUrl(overlayRaw),
        href: `/apartments/${encodeURIComponent(ap.slug || ap.title || "")}`,
        titleText: locale === "en" ? ap.title_en || ap.title : ap.title || "",
        descText:
          locale === "en"
            ? ap.description_en || ap.description || ""
            : ap.description || "",
      };
    });
  }, [apartments, locale]);

  const slidesPerView = isDesktop ? 2 : 1;
  const loopEnabled = items.length > slidesPerView;
  const canSlide = items.length > 1;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    mqRef.current = mq;
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!imageSwiper || !textSwiper) return;

    try {
      imageSwiper.controller.control = textSwiper;
      textSwiper.controller.control = null as any;
    } catch {
      // ignore if controllers not ready
    }

    const idx = 0;
    if (loopEnabled) {
      imageSwiper.slideToLoop(idx, 0);
      textSwiper.slideToLoop(idx, 0);
    } else {
      imageSwiper.slideTo(idx, 0);
      textSwiper.slideTo(idx, 0);
    }
    setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const keyActivate =
    (fn: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };

  // mobile tap: show overlay for a short time if the slide is active
  const handleTouchToggle = (index: number) => {
    if (isDesktop) return;
    if (activeIndex !== index) return;
    setTouchOverlayIndex(index);
    window.setTimeout(() => setTouchOverlayIndex(null), 2500);
  };

  if (!items.length) return null;

  return (
    <section className="row padding-y-90-90 overflow-hidden prop-section-immobile">
      <div className="container">
        <div className="row flex-nowrap">
          {/* text column */}
          <div className="d-flex flex-column justify-content-between slider-col-txt">
            <div>
              <h2 className="main-title-for-slider d-sm-none mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                {t("apartments")}
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
                      <Link
                        href={ap.href}
                        className="slide-lg-enlarge-content d-inline-block pb-3 ff-sans fw-500 fz-24 color-black color-black-hover lh-xs txt-no-underline"
                      >
                        {ap.titleText}
                      </Link>
                    </div>
                    <div className="w-100 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 pb-4 pb-md-5 ff-sans fw-200 fz-18 color-gray lh-sm">
                        {ap.descText}
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
                <span>{t("seeAll")}</span>
              </Link>
            </div>
          </div>

          <div className="d-flex flex-column justify-content-between mobile-title ml-3 d-block d-lg-none">
            <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
              {t("apartments")}
            </h2>
          </div>

          {/* images column */}
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
                  const isPriority = index === 0;
                  const overlayVisible =
                    activeIndex === index &&
                    (hoveredIndex === index || touchOverlayIndex === index);

                  return (
                    <SwiperSlide
                      key={ap._id ?? `img-${index}`}
                      style={{ height: "100%" }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex((v) => (v === index ? null : v))}
                      onClick={() => handleTouchToggle(index)}
                    >
                      <div
                        className="switch-img-wrap swiper-switch-main-img set-background-img card-img"
                        style={{ ...imgMainStyle }}
                      >
                        <Link
                          href={ap.href}
                          className="property-hidden-link"
                          aria-label={ap.titleText}
                        >
                          <span className="sr-only">{ap.titleText}</span>
                        </Link>

                        {/* main image */}
                        <div style={{ position: "absolute", inset: 0 }}>
                          <Image
                            src={ap.mainUrl}
                            alt={ap.titleText || "Apartment image"}
                            fill
                            priority={isPriority}
                            sizes="(min-width: 992px) 50vw, 100vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        {/* overlay image (opacity + scale animated) */}
                        <div
                          className={`overlay-image ${overlayVisible ? "visible" : ""}`}
                          style={overlayContainerStyle}
                          aria-hidden
                        >
                          <Image
                            src={ap.overlayUrl}
                            alt=""
                            fill
                            priority={false}
                            sizes="(min-width: 992px) 25vw, 100vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
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
        .property-hidden-link {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
        }

        .overlay-image {
          z-index: 2;
          border-radius: 8px;
          opacity: 0;
          transform: scale(1);
          transition: opacity 720ms cubic-bezier(0.2, 0.8, 0.2, 1),
            transform 720ms cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
        }
        .overlay-image.visible {
          opacity: 1;
          transform: scale(1.03);
        }

        .card-img-overlay {
          z-index: 2;
          border-radius: 8px;
          transition: opacity 0.3s ease;
          pointer-events: none;
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
            margin-bottom: 0;
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
