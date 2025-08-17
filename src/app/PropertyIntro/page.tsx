"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";

type GalleryImage = {
  src: string;      // تصویر نمایش اسلاید
  href?: string;    // لینک نسخه‌ی بزرگ (برای fancybox اختیاری)
  alt?: string;
};

// می‌تونی این آرایه رو از API/props بیاری
const IMAGES: GalleryImage[] = [
  {
    src: "https://www.santateclaliving.com/wp-content/uploads/2024/01/balcone-1920x1281.jpg",
    href: "https://www.santateclaliving.com/wp-content/uploads/2024/01/balcone-scaled.jpg",
    alt: "Balcone",
  },
  {
    src: "https://www.santateclaliving.com/wp-content/uploads/2024/01/soggiorno_3-1-1920x1280.jpg",
    href: "https://www.santateclaliving.com/wp-content/uploads/2024/01/soggiorno_3-1-scaled.jpg",
    alt: "Soggiorno",
  },
  {
    src: "https://www.santateclaliving.com/wp-content/uploads/2024/01/soggiorno_8-1920x1281.jpg",
    href: "https://www.santateclaliving.com/wp-content/uploads/2024/01/soggiorno_8-scaled.jpg",
    alt: "Soggiorno 2",
  },
  {
    src: "https://www.santateclaliving.com/wp-content/uploads/2024/01/soggiorno_5-1-1920x1280.jpg",
    href: "https://www.santateclaliving.com/wp-content/uploads/2024/01/soggiorno_5-1-scaled.jpg",
    alt: "Soggiorno 3",
  },
  // ... بقیه عکس‌ها رو هم به همین شکل اضافه کن
];

export default function PropertyIntro() {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  return (
    <ClientLayoutWrapper>
      <section className="row padding-y-190-190 single-property-intro">
        <div className="container padding-y-60-60">
          <div className="row">
            {/* عنوان */}
            <div
              className="property-about-text col-12 col-md-4 col-lg-2"
              style={{ minHeight: "416.031px" }}
            >
              <h1 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-xs">
                Carnaghi14
              </h1>
            </div>

            {/* گالری */}
            <div className="col-12 col-md-7 col-lg-9 offset-md-1 gallery-single-prop position-relative">
              <div className="row gallery-prop-wrap">
                <Swiper
                  modules={[Navigation]}
                  className="property-swiper-images"
                  loop
                  spaceBetween={15}
                  breakpoints={{
                    0: { slidesPerView: 1, autoHeight: true },
                    768: { autoHeight: false },
                    992: { slidesPerView: 2 },
                  }}
                  onBeforeInit={(swiper) => {
                    // اتصال دکمه‌های سفارشی
                    // @ts-ignore
                    swiper.params.navigation.prevEl = prevRef.current;
                    // @ts-ignore
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }}
                  navigation={{
                    prevEl: prevRef.current!,
                    nextEl: nextRef.current!,
                  }}
                >
                  {IMAGES.map((img, i) => {
                    const Figure = (
                      <figure
                        className="mb-0 h-100 position-relative overflow-hidden"
                        style={{ aspectRatio: "3 / 2" }}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt || ""}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                          className="img-fluid"
                          priority={i < 2}
                          // اگر دامنه را در next.config اضافه نکردی، برای تست:
                          // unoptimized
                        />
                      </figure>
                    );

                    return (
                      <SwiperSlide key={`${img.src}-${i}`}>
                        <div className="switch-img-wrap swiper-switch-main-img set-background-img">
                          {img.href ? (
                            <a
                              data-fancybox="single-property"
                              href={img.href}
                              className="d-block h-100 w-100 property-hidden-link set-background-img"
                            >
                              {Figure}
                            </a>
                          ) : (
                            Figure
                          )}
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>

              {/* دکمه‌های ناوبری سفارشی (مثل مارکاپ اصلی) */}
              <div className="swiper-button-wrap">
                <div
                  ref={prevRef}
                  className="swiper-button-prev btn-only-arrow only-arrow-black"
                  tabIndex={0}
                  role="button"
                  aria-label="Previous slide"
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
                  aria-label="Next slide"
                >
                  <div className="btn-arrow btn-black btn-white-hover d-flex align-items-center">
                    <svg viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* /گالری */}
          </div>
        </div>
      </section>
    </ClientLayoutWrapper>
  );
}
