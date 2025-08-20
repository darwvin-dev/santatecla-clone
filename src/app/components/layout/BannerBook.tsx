"use client";

import { useId, useState } from "react";

type BannerBookProps = {
  phone?: string; 
  whatsappHref?: string; 
  email?: string;
};

export default function BannerBook({
  phone = "+393519361241",
  whatsappHref = "https://wa.me/393519361241",
  email = "habitabioita@gmail.com",
}: BannerBookProps) {
  const [open, setOpen] = useState(false);
  const collapseId = useId(); 

  return (
    <div className="row living-banner-book d-flex flex-column">
      <div className="living-banner-book-btn d-flex align-items-center justify-content-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={collapseId}
          onClick={() => setOpen((v) => !v)}
          className={`pl-4 banner-change-label d-inline-flex align-items-center btn-rounded btn-filter-wrapp btn-highest btn-white ff-sans fw-300 fz-20 color-white color-green-hover lh-xs txt-no-underline text-center position-relative ${
            open ? "" : "collapsed"
          }`}
        >
          <span className="open-label" style={{ display: open ? "none" : "inline" }}>
            Prenota
          </span>
          <span className="close-label" style={{ display: open ? "inline" : "none" }}>
            Chiudi
          </span>
        </button>
      </div>

      <div
        id={collapseId}
        className={`collapse ${open ? "show" : ""}`}
        style={{ display: open ? "block" : "" }}
      >
        <div className="container padding-y-30-30">
          <div className="row d-flex justify-content-center">
            <div className="col-12 col-md-9 col-xl-6 mb-4">
              <div className="site-content fz-20 text-center">
                <p>Verifica le disponibilità e scopri i vantaggi della prenotazione diretta.</p>
                <p className="mt-0 fw-500">Mandaci la tua richiesta!</p>
              </div>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
              <a
                href={`tel:${phone}`}
                className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
              >
                <span>Chiamaci</span>
                <span className="btn-filter d-flex align-items-center justify-content-center">
                  <i className="webfont icon-wf-st_chiama-tel fz-28 color-black"></i>
                  <span className="btn-filter-hover d-flex align-items-center">
                    <i className="webfont icon-wf-st_chiama-tel fz-28 color-white"></i>
                  </span>
                </span>
              </a>
            </div>

            <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="nofollow noopener"
                className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
              >
                <span>Contattaci</span>
                <span className="btn-filter d-flex align-items-center justify-content-center">
                  <i className="webfont icon-wf-st_chat-wa fz-28 color-black"></i>
                  <span className="btn-filter-hover d-flex align-items-center">
                    <i className="webfont icon-wf-st_chat-wa fz-28 color-white"></i>
                  </span>
                </span>
              </a>
            </div>

            {/* Email */}
            <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
              <a
                href={`mailto:${email}`}
                className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
              >
                <span>Mail</span>
                <span className="btn-filter d-flex align-items-center justify-content-center">
                  <i className="webfont icon-wf-st_chiedi-info fz-28 color-black"></i>
                  <span className="btn-filter-hover d-flex align-items-center">
                    <i className="webfont icon-wf-st_chiedi-info fz-28 color-white"></i>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
