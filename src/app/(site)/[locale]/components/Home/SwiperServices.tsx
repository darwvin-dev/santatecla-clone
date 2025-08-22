"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const services = [
  { icon: "/images/icon-babysitter.png", title: "Baby Sitter" },
  { icon: "/images/icon-beauty.png", title: "Beauty center" },
  { icon: "/images/icon-chef.png", title: "Chef a domicilio" },
  { icon: "/images/icon-gym.png", title: "Palestra" },
  { icon: "/images/icon-parking-1.png", title: "Parcheggio" },
  { icon: "/images/icon-transfer-1.png", title: "Transfer" },
];

export default function SwiperServices() {
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
      {services.map((service, index) => (
        <SwiperSlide key={index} className="d-flex">
          <div className="d-inline-flex flex-column mx-auto">
            <figure className="d-inline-block fp-services-icon">
              <img src={service.icon} alt={service.title} className="img-fluid" />
            </figure>
            <span className="ff-sans fw-500 color-black fz-24 lh-sm">
              {service.title}
            </span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}