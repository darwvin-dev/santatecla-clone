import { DynamicPart } from "@/types/DynamicPart";
import { useLocale } from "next-intl";
import Image from "next/image";
import React from "react";

export default function HomeAbout({
  about,
}: {
  about: DynamicPart | undefined;
}) {
  const locale = useLocale();
  const title =
    locale === "en" ? about?.title_en || about?.title : about?.title;
  const description =
    locale === "en"
      ? about?.description_en || about?.description
      : about?.description;

  return (
    <section className="row padding-y-90-90 prop-section-about">
      <div className="w-100 position-relative overflow-hidden property-about-container">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-12 col-md-6 col-lg-6 prop-about-img-wrap">
              <div className="prop-about-img prop-minheight-img">
                <figure className="mb-0">
                  <Image
                    src={about?.image || "/placeholder.jpg"}
                    alt={title || ""}
                    width={1920}
                    height={1280}
                    className="img-fluid"
                    priority 
                    style={{ objectFit: "cover" }}
                  />
                </figure>
              </div>
            </div>
            <div className="property-about-text col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between">
              <div>
                <h2 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                  {title}
                </h2>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  <p style={{ whiteSpace: "pre-line" }}>
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
