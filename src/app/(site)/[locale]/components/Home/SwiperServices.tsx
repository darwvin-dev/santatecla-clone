"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";

const items = [
  { key: "babysitter", icon: "/images/icon-babysitter.png" },
  { key: "beauty", icon: "/images/icon-beauty.png" },
  { key: "chef", icon: "/images/icon-chef.png" },
  { key: "gym", icon: "/images/icon-gym.png" },
  { key: "parking", icon: "/images/icon-parking-1.png" },
  { key: "transfer", icon: "/images/icon-transfer-1.png" },
] as const;

export default function SwiperServices() {
  const t = useTranslations("homepage.services");

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      breakpoints={{
        0: { slidesPerView: 1, slidesPerGroup: 1 },
        576: { slidesPerView: 2, slidesPerGroup: 2 },
        768: { slidesPerView: 3, slidesPerGroup: 3 },
      }}
      spaceBetween={30}
      className="swiper swiper-fp-service pb-5"
    >
      {items.map((service) => (
        <SwiperSlide key={service.key} className="d-flex">
          <div className="d-inline-flex flex-column mx-auto align-items-center text-center">
            <figure
              className="d-inline-block fp-services-icon mb-3"
              style={{ margin: 0 }}
            >
              <img
                src={service.icon}
                alt={t(`items.${service.key}`)}
                className="img-fluid"
                loading="lazy"
              />
            </figure>
            <span className="ff-sans fw-500 color-black fz-24 lh-sm">
              {t(`items.${service.key}`)}
            </span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
