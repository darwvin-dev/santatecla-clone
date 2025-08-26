import React from "react";
import { DynamicPart } from "@/types/DynamicPart";
import { useLocale } from "next-intl";

export default function GestioneAbout({ abouts }: { abouts: DynamicPart[] }) {
  if (!abouts || abouts.length === 0) return null;
  const locale = useLocale();

  return (
    <>
      {abouts.map((about, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            key={`about_${about._id || index}`}
            className={`row padding-y-90-90 prop-section-about`}
          >
            <div className="w-100 position-relative overflow-hidden property-about-container">
              <div className="container h-100">
                <div
                  className="row h-100"
                  style={{ flexFlow: !isEven ? "row-reverse" : "" }}
                >
                  <div className="col-12 col-md-6 col-lg-6 prop-about-img-wrap">
                    <div
                      className="prop-about-img prop-minheight-img"
                      style={{
                        left: !isEven ? 0 : "unset",
                        right: isEven ? 0 : "unset",
                      }}
                    >
                      <img
                        src={about.image || "/fallback-image.jpg"}
                        alt={about.title || "About section image"}
                        width="1920"
                        height="1280"
                        loading="lazy"
                        decoding="async"
                        className="about-img"
                      />
                    </div>
                  </div>
                  <div
                    className="property-about-text col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between"
                    style={{ marginRight: !isEven ? "8.33333333%" : "" }}
                  >
                    <div>
                      {about.title && (
                        <h2 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                          {locale === "en"
                            ? about.title_en || about.title
                            : about.title}
                        </h2>
                      )}
                      {about.description && (
                        <div
                          className="about-desc"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {locale === "en"
                            ? about.description_en || about.description
                            : about.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
              /* Base section styling */
              .about-section {
                margin: 1.5rem -15px;
                padding: 4rem 0; /* Replaces padding-y-90-90 for consistency */
              }

              /* Flex container for row */
              .about-row {
                display: flex;
                gap: 1rem;
              }

              /* Image column */
              .about-image {
                flex: 1 1 50%;
                max-width: 50%;
                position: relative;
                overflow: hidden;
              }

              .about-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                display: block;
                min-height: 360px; /* Minimum height for consistency */
              }

              /* Text column */
              .about-text {
                flex: 1 1 50%;
                max-width: 500px;
                display: flex;
                align-items: center;
                margin: auto;
              }

              .about-text-inner {
                max-width: var(
                  --textMax,
                  500px
                ); /* Fallback to 500px if undefined */
              }

              /* Alternating layout */
              .left-image .about-image {
                order: 0;
              }
              .left-image .about-text {
                order: 1;
                padding-right: var(--edgePad, 1.5rem); /* Fallback padding */
              }

              .right-image .about-image {
                order: 1;
              }
              .right-image .about-text {
                order: 0;
                padding-left: var(--edgePad, 1.5rem); /* Fallback padding */
              }

              /* Text styling */
              .about-title {
                margin: 0 0 1rem 0;
                line-height: 1.2;
                font-weight: 600;
                font-size: clamp(1.375rem, 3vw, 2rem); /* 22px to 32px */
                color: #111;
              }

              .about-desc {
                font-size: clamp(0.9375rem, 1.6vw, 1.125rem); /* 15px to 18px */
                line-height: 1.7;
                color: #4a4a4a;
                font-weight: 300;
              }

              /* Responsive design */
              @media (max-width: 768px) {
                .about-row {
                  flex-direction: column;
                  gap: 0;
                }

                .about-image,
                .about-text {
                  max-width: 100%;
                  order: 2 !important; /* Ensure text below image on mobile */
                }

                .about-image {
                  height: clamp(220px, 42vw, 360px);
                }

                .about-text {
                  padding: 1rem clamp(1rem, 5vw, 1.5rem);
                  margin: auto;
                }
                .about-image {
                  padding: 1rem clamp(1rem, 5vw, 1.5rem);
                  margin: auto;
                }

                .about-text-inner {
                  max-width: none;
                }
              }
            `}</style>
          </section>
        );
      })}
    </>
  );
}
