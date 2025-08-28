import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Controller, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import type { Swiper as SwiperType } from "swiper";
import { DynamicPart } from "@/types/DynamicPart";
import { useLocale } from "next-intl";

export default function ExperiencesSection({
  experiences,
}: {
  experiences: DynamicPart[];
}) {
  const IMAGE_HEIGHT_DESKTOP = 240;
  const IMAGE_HEIGHT_MOBILE = 160;
  const pickImg = (x: DynamicPart) =>
    x.image || x.mobileImage || "/images/placeholder.jpg";

  const locale = useLocale();
  const [textSwiper, setTextSwiper] = useState<SwiperType | null>(null);
  const [imageSwiper, setImageSwiper] = useState<SwiperType | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const baseData = experiences.find((e) => !e.parentId);
  const sorted = useMemo(
    () =>
      [...(experiences.filter((e) => e.parentId) || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    [experiences]
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slidesPerView = isDesktop ? 2 : 1;
  const loopEnabled = sorted.length > slidesPerView;
  const canSlide = sorted.length > 1;

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
    <section
      id="slider-invertito"
      className="row padding-y-90-120 overflow-hidden design-team-wrapper"
      style={{ width: "100%" }}
    >
      <div
        className="container"
        style={{ width: "100%", margin: 0, padding: 0 }}
      >
        <div className="row" style={{ width: "100%", margin: 0 }}>
          <div
            className="col-12 col-md-5 col-lg-6"
            style={{ width: "100%", margin: 0, padding: 0 }}
          >
            <div
              className="row position-relative"
              id="teamsSlideImagesDesktop"
              style={{ width: "100%", margin: 0 }}
            >
              <Swiper
                dir="rtl"
                className="team-swiper-images"
                modules={[Controller]}
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
                {sorted.map((item) => (
                  <SwiperSlide key={item._id}>
                    <div
                      className="switch-img-wrap swiper-switch-main-img set-background-img"
                      style={
                        {
                          backgroundImage: `url(${
                            process.env.NEXT_PUBLIC_DOMAIN_ADDRESS
                          }${pickImg(item)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          width: "100%",
                          height:
                            typeof window !== "undefined" &&
                            window.innerWidth < 768
                              ? IMAGE_HEIGHT_MOBILE
                              : IMAGE_HEIGHT_DESKTOP,
                        } as React.CSSProperties
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* ستون متن + ناوبری */}
          <div className="d-flex flex-column justify-content-between slider-col-txt col-12 col-md-7 col-lg-6">
            <div className="position-relative team-wrapper">
              <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
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
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 27 27"
                      width="27"
                      height="27"
                    >
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                    </svg>
                  </div>
                </button>
                <button
                  className="swiper-button-next btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
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
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 27 27"
                      width="27"
                      height="27"
                    >
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
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
                {sorted.map((item) => (
                  <SwiperSlide key={item._id}>
                    <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                        {locale === "en"
                          ? item.title_en || item.title
                          : item.title || "—"}
                      </p>
                    </div>
                    <div className="w-100 position-relative">
                      <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                        <p style={{ margin: 0 }}>
                          {locale === "en"
                            ? item.description_en || item.description
                            : item.description}
                        </p>
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
