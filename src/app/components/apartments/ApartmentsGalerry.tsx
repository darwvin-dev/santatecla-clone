"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  name: string;
  images: string[]; // ✅ به‌جای [string]
};

export default function ApartmentsGalerry({ images, name }: Props) {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const [navReady, setNavReady] = useState(false);

  // اگر آرایه خالی یا null باشه، چیزی رندر نکنه
  const items = useMemo(() => (images ?? []).filter(Boolean), [images]);

  useEffect(() => {
    // بعد از mount، refها حاضرن → اجازه بده Swiper ناوبری رو init کنه
    setNavReady(true);
  }, []);

  if (!items.length) return null;

  return (
    <section className="row padding-y-190-190 single-property-intro">
      <div className="container padding-y-60-60">
        <div className="row">
          {/* عنوان */}
          <div className="property-about-text col-12 col-md-4 col-lg-2" style={{ minHeight: 416 }}>
            <h1 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-xs">{name}</h1>
          </div>

          {/* گالری */}
          <div className="col-12 col-md-7 col-lg-9 offset-md-1 gallery-single-prop position-relative">
            <div className="row gallery-prop-wrap">
              <Swiper
                modules={[Navigation]}
                className="property-swiper-images"
                loop={items.length > 1}
                spaceBetween={15}
                navigation={{
                  prevEl: prevRef.current!,
                  nextEl: nextRef.current!,
                }}
                onBeforeInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                onInit={(swiper) => {
                  if (navReady) {
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                }}
                breakpoints={{
                  0: { slidesPerView: 1, autoHeight: true },
                  768: { autoHeight: false },
                  992: { slidesPerView: 2 },
                }}
              >
                {items.map((src, i) => (
                  <SwiperSlide key={`${src}-${i}`}>
                    <div className="switch-img-wrap swiper-switch-main-img set-background-img">
                      <a
                        data-fancybox="single-property"
                        href={src}
                        className="d-block h-100 w-100 property-hidden-link set-background-img"
                        aria-label={`Apri immagine ${i + 1}`}
                      >
                        <figure
                          className="mb-0 h-100 position-relative overflow-hidden"
                          style={{ aspectRatio: "3 / 2" }}
                        >
                          <Image
                            src={src}
                            alt={`${name} – immagine ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: "cover" }}
                            className="img-fluid"
                            priority={i < 2}
                          />
                        </figure>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {items.length > 1 && (
              <div className="swiper-button-wrap">
                <div
                  ref={prevRef}
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Slide precedente"
                >
                  <div className="btn-arrow btn-black btn-white-hover btn-right d-flex align-items-center">
                    <svg viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                    </svg>
                  </div>
                </div>
                <div
                  ref={nextRef}
                  className="swiper-button-next btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Slide successiva"
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
