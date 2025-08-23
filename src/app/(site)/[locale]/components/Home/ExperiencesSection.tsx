import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Controller, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { useRef, useMemo, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { DynamicPart } from "@/types/DynamicPart";
import { useLocale } from "next-intl";

export default function ExperiencesSection({
  experiences,
}: {
  experiences: DynamicPart[];
}) {
  const locale = useLocale();

  const textSwiperRef = useRef<SwiperType | null>(null);
  const imageSwiperRef = useRef<SwiperType | null>(null);

  const prevElRef = useRef<HTMLDivElement | null>(null);
  const nextElRef = useRef<HTMLDivElement | null>(null);

  const baseData = experiences.find((e) => !e.parentId);
  const sorted = useMemo(
    () =>
      [...(experiences.filter((e) => e.parentId) || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    [experiences]
  );

  const IMAGE_HEIGHT_DESKTOP = 240;
  const IMAGE_HEIGHT_MOBILE = 160;
  const pickImg = (x: DynamicPart) =>
    x.image || x.mobileImage || "/images/placeholder.jpg";

  useEffect(() => {
    const t = textSwiperRef.current;
    const i = imageSwiperRef.current;
    if (t && i) {
      t.controller.control = i;
      i.controller.control = t;

      try {
        t.navigation?.update();
      } catch {}
    }
  }, [textSwiperRef.current, imageSwiperRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sorted.length) return null;

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
          {/* ستون تصاویر */}
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
                onSwiper={(swiper) => {
                  imageSwiperRef.current = swiper;
                }}
                slidesPerView={2}
                spaceBetween={15}
                loop={sorted.length > 1}
                // فقط خواندن؛ ست کردن control را به useEffect سپردیم
                controller={{ control: textSwiperRef.current as any }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 10 },
                  768: { slidesPerView: 2, spaceBetween: 15 },
                }}
                watchSlidesProgress
                style={{ width: "100%" }}
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
                {locale === "en" ? (baseData?.title_en || baseData?.title) : baseData?.title ?? "Esperienze a Milano"}
              </h2>

              <div
                className="swiper-button-wrap pos-nav-change-first-slider"
                style={{ display: "flex", gap: 12 }}
              >
                <div
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Previous slide"
                  style={{ cursor: "pointer" }}
                  ref={prevElRef}
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
                </div>
                <div
                  className="swiper-button-next btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Next slide"
                  style={{ cursor: "pointer" }}
                  ref={nextElRef}
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
                </div>
              </div>

              <Swiper
                className="team-swiper swiper-fade"
                modules={[EffectFade, Controller, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                onBeforeInit={(swiper) => {
                  (swiper.params.navigation as any).prevEl = prevElRef.current;
                  (swiper.params.navigation as any).nextEl = nextElRef.current;
                }}
                onSwiper={(swiper) => {
                  textSwiperRef.current = swiper;
                  // init/update ناوبری مطابق الگوی فعلی
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                slidesPerView={1}
                loop={sorted.length > 1}
                // فقط خواندن؛ ست کردن control را به useEffect سپردیم
                controller={{ control: imageSwiperRef.current as any }}
                watchSlidesProgress
              >
                {sorted.map((item) => (
                  <SwiperSlide key={item._id}>
                    <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                        {locale === "en" ? (item.title_en || item.title) : item.title || "—"}
                      </p>
                    </div>
                    <div className="w-100 position-relative">
                      <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                        <p style={{ margin: 0 }}>{locale === 'en' ? (item.description_en || item.description) : item.description}</p>
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
