'use client';

import Image from 'next/image';
import React from 'react';

interface ApartmentCardProps {
  title: string;
  image: string;
  link: string;
  description: string;
  guests: number;
  beds: number;
  size: string;
  address: string;
}

export default function ApartmentCard({
  title,
  image,
  link,
  description,
  guests,
  beds,
  size,
  address,
}: ApartmentCardProps) {
  return (
    <div className="container-fluid padding-y-60-60 single-property-archive">
      <div className="row">
        <div className="container">
          <div className="row">
            {/* Image */}
            <div className="col-12 col-md-6 overflow-hidden">
              <a href={link} className="d-inline-block w-100 h-100">
                <figure className="mb-0 property-archive-img overflow-hidden position-relative" style={{ aspectRatio: '3/2' }}>
                  <Image
                    src={image}
                    alt={title}
                    className="w-100 h-100 object-cover img-zoomInOut"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <figcaption className="sr-only color-black">{title}</figcaption>
                </figure>
              </a>
            </div>

            {/* Info */}
            <div className="col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between mt-4 mt-md-0 txt-opacityInOut animated">
              <div>
                <a href={link} className="d-inline-block ff-sans fw-400 fz-21 color-black color-black-hover lh-xs txt-no-underline">
                  {title}
                </a>
                <div className="mt-3 site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  <p>{description}</p>
                </div>
              </div>

              <div>
                <div className="d-flex flex-row flex-wrap align-items-md-center property-archive-info mt-4">
                  <p className="mb-2 mb-md-0 ff-sans fw-200 fz-21 color-gray lh-xs">
                    {guests} guests
                  </p>
                  <p className="mb-2 mb-md-0 fz-21 color-black lh-xs mx-2">|</p>
                  <p className="mb-2 mb-md-0 ff-sans fw-200 fz-21 color-gray lh-xs">
                    {beds} bed{beds > 1 ? 's' : ''}
                  </p>
                  <p className="mb-2 mb-md-0 fz-21 color-black lh-xs mx-2">|</p>
                  <p className="mb-2 mb-md-0 ff-sans fw-200 fz-21 color-gray lh-xs">
                    {size}
                  </p>
                </div>

                <div className="mt-md-3">
                  <p className="mb-0 ff-sans fw-200 fz-21 color-black lh-xs">{address}</p>
                </div>

                <div className="pt-4">
                  <a href={link} className="position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline">
                    <span>Find out more</span>
                    <span className="btn-arrow btn-block btn-white-hover ms-2">
                      <svg viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
