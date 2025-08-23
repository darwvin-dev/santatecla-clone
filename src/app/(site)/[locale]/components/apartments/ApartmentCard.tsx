"use client";

import Link from "next/link";
import React from "react";
import ScaleInImage from "../ui/ImageScaleIn";
import { useTranslations } from "next-intl";

type ApartmentCardProps = {
  title: string;
  image: string;
  description: string;
  guests: number;
  sizeSqm: string;
  address: string;
  className?: string;
  reversed?: boolean;
};

export default function ApartmentCard({
  title,
  image,
  description,
  guests,
  sizeSqm,
  address,
  className = "",
  reversed = false,
}: ApartmentCardProps) {
  const imgColClasses = reversed
    ? "col-12 col-md-6 offset-lg-1 order-md-2 overflow-hidden"
    : "col-12 col-md-6 overflow-hidden";

  const infoColClasses = reversed
    ? "col-12 col-md-6 col-lg-5 order-md-1 d-flex flex-column justify-content-between mt-4 mt-md-0"
    : "col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between mt-4 mt-md-0";

  const t = useTranslations("apartments.card");

  return (
    <div
      className={`container-fluid padding-y-60-60 single-property-archive ${className}`}
    >
      <div className="row">
        <div className="container">
          <div className="row">
            {/* Image */}
            <div className={imgColClasses}>
              <a
                href={`/apartments/${title}/`}
                className="d-inline-block w-100 h-100"
              >
                <figure className="mb-0 property-archive-img overflow-hidden position-relative">
                  <ScaleInImage src={image} alt={title} />
                  <figcaption className="sr-only color-black">
                    {title}
                  </figcaption>
                </figure>
              </a>
            </div>

            {/* Info */}
            <div className={infoColClasses}>
              <div>
                <a
                  href={`/apartments/${title}/`}
                  className="d-inline-block ff-sans fw-400 fz-21 color-black color-black-hover lh-xs txt-no-underline"
                >
                  {title}
                </a>
                <div className="mt-3 site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  <p>{description}</p>
                </div>
              </div>

              <div>
                <div className="d-flex flex-row flex-wrap align-items-md-center property-archive-info mt-4">
                  <p className="mb-2 mb-md-0 ff-sans fw-200 fz-21 color-gray lh-xs">
                    {guests} {t("guests")}
                  </p>
                  <p className="mb-2 mb-md-0 ff-sans fw-200 fz-21 color-black lh-xs">
                    &nbsp;|&nbsp;
                  </p>
                  <p className="mb-2 mb-md-0 ff-sans fw-200 fz-21 color-gray lh-xs">
                    {sizeSqm} {t("sqm")}
                  </p>
                </div>
                <div className="mt-md-3">
                  <p className="mb-0 ff-sans fw-200 fz-21 color-black lh-xs">
                    {address}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href={`/apartments/${title}/`}
                    className="position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                  >
                    <span>{t("readMore")}</span>
                    <span className="btn-arrow btn-block btn-white-hover">
                      <svg viewBox="0 0 27 27">
                        <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
