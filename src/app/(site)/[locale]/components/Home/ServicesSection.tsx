import dynamic from "next/dynamic";

const SwiperServices = dynamic(() => import("./SwiperServices"), { 
  ssr: false,
  loading: () => <div>Loading services...</div>
});

export default function ServicesSection() {
  return (
    <section className="row d-flex padding-y-60-60 swiper-fp-service-wrap">
      <div className="container">
        <h2 className="mb-0 padding-y-0-80 ff-sans fw-400 fz-32 color-black lh-xs">
          Servizi extra on demand{" "}
        </h2>
        <SwiperServices />
      </div>
    </section>
  );
}