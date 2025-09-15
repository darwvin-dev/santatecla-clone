"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  name: string;
  images: string[];
};

export default function ApartmentsGallery({ images, name }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLDivElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const items = useMemo(() => (images ?? []).filter(Boolean), [images]);

  // وقتی هر دو دکمه حاضر شدند، ناوبری رو دوباره bind و init کن
  useEffect(() => {
    if (!swiperRef.current || !prevEl || !nextEl) return;

    swiperRef.current.params.navigation = {
      ...(swiperRef.current.params.navigation as any),
      prevEl,
      nextEl,
    };

    // برای اطمینان، destroy -> init -> update
    swiperRef.current.navigation.destroy();
    swiperRef.current.navigation.init();
    swiperRef.current.navigation.update();
  }, [prevEl, nextEl]);

  if (!items.length) return null;

  return (
    <section className="row padding-y-190-190 single-property-intro">
      <div className="container padding-y-60-60">
        <div className="row prampolini-apartment">
          <div className="property-about-text col-12 col-md-4 col-lg-2">
            <h1 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-xs">
              {name}
            </h1>
          </div>

          {/* Gallery */}
          <div className="offset-md-1 gallery-single-prop position-relative w-125">
            <div className="row gallery-prop-wrap">
              <Swiper
                key={prevEl && nextEl ? "with-nav" : "no-nav"} // کمک می‌کند Swiper بعد از آماده‌شدن دکمه‌ها رندر شود
                modules={[Navigation]}
                className="property-swiper-images"
                loop={items.length > 2}
                spaceBetween={15}
                navigation={{ prevEl, nextEl }} // مقدار اولیه؛ binding نهایی در useEffect
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                  0: { slidesPerView: 1, autoHeight: true },
                  768: { autoHeight: false },
                  992: { slidesPerView: 2 },
                }}
              >
                {items.map((src, i) => (
                  <SwiperSlide key={`${src}-${i}`} style={{ height: "auto" }}>
                    <div className="switch-img-wrap swiper-switch-main-img">
                      <a
                        data-fancybox="single-property"
                        href={`${process.env.NEXT_PUBLIC_DOMAIN_ADDRESS}${src}`}
                        className="d-block w-100 property-hidden-link"
                        aria-label={`Apri immagine ${i + 1}`}
                      >
                        <figure
                          className="mb-0 position-relative overflow-hidden"
                          style={{ width: "100%", aspectRatio: "3/2" }}
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_DOMAIN_ADDRESS}${src}`}
                            alt={`${name} – immagine ${i + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={i === 0}
                            loading={i === 0 ? "eager" : "lazy"}
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
                  ref={setPrevEl} // callback ref
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
                  ref={setNextEl} // callback ref
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
