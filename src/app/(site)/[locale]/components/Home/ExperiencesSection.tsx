"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Controller } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { DynamicPart } from "@/types/DynamicPart";
import { useLocale } from "next-intl";
import { resolveUrl } from "@/lib/helper";

type Props = {
  experiences: DynamicPart[];
};

export default function ExperiencesSection({ experiences }: Props) {
  const locale = useLocale();
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const baseData = useMemo(
    () => experiences.find((e) => !e.parentId),
    [experiences]
  );
  const sorted = useMemo(
    () =>
      [...(experiences.filter((e) => e.parentId) || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    [experiences]
  );

  const items = useMemo(
    () =>
      sorted.map((it) => {
        const img = it.image || it.mobileImage || "/images/placeholder.jpg";
        return {
          ...it,
          imgUrl: resolveUrl(img),
          titleText:
            locale === "en" ? it.title_en || it.title : it.title || "—",
          descText:
            locale === "en"
              ? it.description_en || it.description
              : it.description || "",
        };
      }),
    [sorted, locale]
  );

  const mqRef = useRef<MediaQueryList | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    mqRef.current = mq;
    const onChange = () => setIsDesktop(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    onChange();
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const slidesPerView = isDesktop ? 2 : 1;
  const loopEnabled = items.length > slidesPerView;
  const canSlide = items.length > 1;

  useEffect(() => {
    if (!imageSwiper || !textSwiper) return;

    try {
      imageSwiper.controller.control = textSwiper;
      textSwiper.controller.control = null as any;
    } catch {
      /* ignore controller linking errors */
    }

    const startIdx = 0;
    if (loopEnabled) {
      imageSwiper.slideToLoop(startIdx, 0);
      textSwiper.slideToLoop(startIdx, 0);
    } else {
      imageSwiper.slideTo(startIdx, 0);
      textSwiper.slideTo(startIdx, 0);
    }
  }, [imageSwiper, textSwiper, loopEnabled]);

  const onImageChanged = useCallback(
    (swiper: SwiperType) => {
      const idx = swiper.realIndex ?? swiper.activeIndex ?? 0;
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

  if (!items.length) return null;

  return (
    <section
      id="slider-invertito"
      className="row padding-y-90-120 overflow-hidden design-team-wrapper"
      style={{ width: "100%" }}
    >
      <div
        className="container"
        style={{ padding: 0, margin: "0 auto", width: "100%" }}
      >
        <div className="d-flex flex-column mobile-title d-block d-lg-none">
          <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
            {locale === "en"
              ? baseData?.title_en || baseData?.title
              : baseData?.title ?? "Esperienze a Milano"}
          </h2>
        </div>

        <div className="row" style={{ width: "100%", margin: "0 auto", padding: 0, justifyContent: "center", justifyItems: "center", justifySelf: "center" }}>
          {/* images column */}
          <div className="col-12 col-md-5 col-lg-6" style={{ padding: 0 }}>
            <div
              className="row position-relative"
              style={{ width: "100%", margin: "auto" }}
            >
              <Swiper
                // dir="rtl"
                className="team-swiper-images"
                modules={[Controller]}
                loop={loopEnabled}
                // spaceBetween={15}
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
                {items.map((item, idx) => (
                  <SwiperSlide key={item._id ?? idx}>
                    <div
                      className="switch-img-wrap swiper-switch-main-img set-background-img"
                      style={{
                        width: "100%",
                        overflow: "hidden",
                        height: "clamp(160px, 24vw, 240px)",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={item.imgUrl}
                        alt={item.titleText || ""}
                        priority={idx === 0}
                        width={800}
                        height={500}
                        sizes="(min-width: 992px) 50vw, 100vw"
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* text + nav column */}
          <div className="d-flex flex-column justify-content-between slider-col-txt col-12 col-md-7 col-lg-6">
            <div className="position-relative team-wrapper">
              <h2 className="main-title-for-slider d-sm-none mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                {locale === "en"
                  ? baseData?.title_en || baseData?.title
                  : baseData?.title ?? "Esperienze a Milano"}
              </h2>

              <div
                className="swiper-button-wrap pos-nav-change-first-slider"
                style={{ display: "flex", gap: 12 }}
              >
                <button
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Previous slide"
                  onClick={handleNext}
                  onKeyDown={keyActivate(handleNext)}
                  disabled={!canSlide}
                  style={{
                    cursor: canSlide ? "pointer" : "not-allowed",
                    opacity: canSlide ? 1 : 0.5,
                  }}
                >
                  <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27" aria-hidden>
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                    </svg>
                  </div>
                </button>

                <button
                  className="swiper-button-next btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Next slide"
                  style={{
                    cursor: canSlide ? "pointer" : "not-allowed",
                    opacity: canSlide ? 1 : 0.5,
                  }}
                  onClick={handlePrev}
                  onKeyDown={keyActivate(handlePrev)}
                  disabled={!canSlide}
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg viewBox="0 0 27 27" width="27" height="27" aria-hidden>
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                    </svg>
                  </div>
                </button>
              </div>

              <Swiper
                className="team-swiper swiper-fade"
                modules={[EffectFade, Controller]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={loopEnabled}
                allowTouchMove={false}
                onSwiper={setTextSwiper}
                observer
                observeParents
                resizeObserver
              >
                {items.map((item, idx) => (
                  <SwiperSlide key={item._id ?? idx}>
                    <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                        {item.titleText}
                      </p>
                    </div>
                    <div className="w-100 position-relative">
                      <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                        <p style={{ margin: 0 }}>{item.descText}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
