import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const SwiperServices = dynamic(() => import("./SwiperServices"), {
  ssr: false,
  loading: () => <div>Loading services...</div>,
});

export default function ServicesSection() {
  const t = useTranslations("homepage.services");

  return (
    <section className="row d-flex padding-y-60-60 swiper-fp-service-wrap">
      <div className="container">
        <h2 className="mb-0 padding-y-0-80 ff-sans fw-400 fz-32 color-black lh-xs">
          {t("title")}
        </h2>
        <SwiperServices />
      </div>
    </section>
  );
}
