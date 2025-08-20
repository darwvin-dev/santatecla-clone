import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Controller, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { useRef, useMemo, useState, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import type { DynamicPart } from "@/types/DynamicPart";

export default function ExperiencesSection({
  experiences,
}: {
  experiences: DynamicPart[];
}) {
  const textSwiperRef = useRef<SwiperType | null>(null);
  const imageDesktopRef = useRef<SwiperType | null>(null);
  const imageMobileRef = useRef<SwiperType | null>(null);

  const prevElRef = useRef<HTMLDivElement | null>(null);
  const nextElRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const baseData = experiences.find((e) => !e.parentId);
  const sorted = useMemo(
    () =>
      [...(experiences.filter((e) => e.parentId) || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    [experiences]
  );

  const pickImg = (x: DynamicPart) =>
    x.image || x.mobileImage || "/images/placeholder.jpg";

  const canLoopDesktop = sorted.length > 2; // چون desktop دو تا به نما داره
  const canLoopMobile = sorted.length > 1;

  useEffect(() => {
    const t = textSwiperRef.current;
    const i = isMobile ? imageMobileRef.current : imageDesktopRef.current;
    if (t && i) {
      t.controller.control = i;
      i.controller.control = t;
      t.navigation?.update();
    }
  }, [isMobile, textSwiperRef.current, imageDesktopRef.current, imageMobileRef.current]); // eslint-disable-line

  if (!sorted.length) return null;

  return (
    <section
      id="slider-invertito"
      className="row padding-y-90-120 overflow-hidden design-team-wrapper"
    >
      <div className="row flex-wrap flex-md-nowrap" style={{ width: "100%", margin: 0 }}>
        {/* ستون تصاویر — فقط دسکتاپ/تبلت */}
        <div className="order-1 order-md-1 mb-3 mb-md-0 d-none d-md-block" style={{ maxWidth: "50%" }}>
          <div className="row position-relative" style={{ width: "100%", margin: 0 }}>
            <Swiper
              className="team-swiper-images"
              modules={[Controller]}
              onSwiper={(swiper) => { imageDesktopRef.current = swiper; }}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 15 },
              }}
              loop={canLoopDesktop}
              style={{ width: "100%" }}
            >
              {sorted.map((item) => (
                <SwiperSlide key={item._id}>
                  <div
                    className="switch-img-wrap swiper-switch-main-img set-background-img"
                    style={{
                      backgroundImage: `url(${pickImg(item)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                    } as React.CSSProperties}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ستون متن + ناوبری */}
        <div className="d-flex flex-column justify-content-between slider-col-txt col-12 col-md-7 col-lg-6 order-2 order-md-2">
          <div className="position-relative team-wrapper">
            <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
              {baseData?.title ?? "Esperienze a Milano"}
            </h2>

            <div className="d-block d-md-none" style={{ marginTop: 12, marginBottom: 16 }}>
              <Swiper
                className="team-swiper-images-mobile"
                modules={[Controller]}
                onSwiper={(swiper) => { imageMobileRef.current = swiper; }}
                slidesPerView={1}
                spaceBetween={10}
                loop={canLoopMobile}
                style={{ width: "100%" }}
              >
                {sorted.map((item) => (
                  <SwiperSlide key={item._id}>
                    <div
                      className="switch-img-wrap swiper-switch-main-img set-background-img"
                      style={{
                        backgroundImage: `url(${pickImg(item)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        aspectRatio: "16 / 10",
                      } as React.CSSProperties}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div
              className="swiper-button-wrap pos-nav-change-first-slider"
              style={{ display: "flex", gap: 12, marginBottom: 20 }}
            >
              <div
                className="swiper-button-prev btn-only-arrow only-arrow-black"
                tabIndex={0}
                role="button"
                aria-label="Previous slide"
                style={{ cursor: "pointer" }}
                ref={prevElRef}
              >
                <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width="27" height="27">
                    <path d="M10.192 3.954l.707.707L2.561 13H26.354v1H2.56l8.339 8.339-.707.707L.646 13.5z"></path>
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width="27" height="27">
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
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              slidesPerView={1}
              loop={sorted.length > 1}
            >
              {sorted.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                    <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                      {item.title || "—"}
                    </p>
                  </div>
                  <div className="w-100 position-relative">
                    <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                      <p style={{ margin: 0 }}>{item.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
