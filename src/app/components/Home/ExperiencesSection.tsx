import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useState } from "react";

const experiences = [
  {
    title: "Tramonto sulla cima del Duomo",
    description: "Ammira lo skyline di Milano da un punto di vista eccezionale...",
    image: "https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_242806454-1920x1280.jpeg"
  },
  {
    title: "Cena sul tram",
    description: "Per trascorrere una serata indimenticabile nella nostra bellissima Milano...",
    image: "https://www.santateclaliving.com/wp-content/uploads/2023/03/tram-ristorante-atmosfera.jpeg"
  },
  {
    title: "Giro in 500 d'epoca",
    description: "Vuoi visitare Milano da un punto di vista unico e in vero stile italiano?...",
    image: "https://www.santateclaliving.com/wp-content/uploads/2023/03/adobestock_214367292-1920x2410.jpeg"
  }
];

export default function ExperiencesSection() {
  const [textSwiper, setTextSwiper] = useState(null);
  const [imageSwiper, setImageSwiper] = useState(null);

  return (
    <section id="slider-invertito" className="row padding-y-90-120 overflow-hidden design-team-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-5 col-lg-6">
            <div className="row position-relative">
              <Swiper
                modules={[Controller]}
                loop
                controller={{ control: textSwiper }}
                onSwiper={setImageSwiper}
                className="team-swiper-images"
                dir="rtl"
              >
                {experiences.map((exp, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="switch-img-wrap swiper-switch-main-img set-background-img"
                      style={{ backgroundImage: `url(${exp.image})` }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="d-flex flex-column justify-content-between slider-col-txt">
            <div className="position-relative team-wrapper">
              <h2 className="main-title-for-slider mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                Esperienze a Milano{" "}
              </h2>
              <div className="swiper-button-wrap pos-nav-change-first-slider">
                {/* Navigation buttons */}
              </div>
              <Swiper
                modules={[EffectFade, Controller]}
                effect="fade"
                loop
                controller={{ control: imageSwiper }}
                onSwiper={setTextSwiper}
                className="team-swiper"
              >
                {experiences.map((exp, index) => (
                  <SwiperSlide key={index}>
                    <div className="pt-1 pt-md-0 w-100 padding-y-0-25 position-relative">
                      <p className="slide-lg-enlarge-content mb-0 ff-sans fw-400 fz-24 color-black lh-xs">
                        {exp.title}
                      </p>
                    </div>
                    <div className="w-100 position-relative">
                      <div className="slide-lg-enlarge-content site-content mb-0 ff-sans fw-200 fz-18 color-gray lh-sm">
                        <p>{exp.description}</p>
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