"use client";

import { useId, useState, useEffect } from "react";
import { useTranslations } from "use-intl";

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
  const [mounted, setMounted] = useState(false);
  const collapseId = "collapseBannerBook";
  const t = useTranslations("booking");

  useEffect(() => {
    setMounted(true);
  }, []);

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
          data-open={open}
        >
          <span className="btn-label-wrap">
            <span className={`btn-label ${open || !mounted ? "out" : "in"}`}>
              {t("book")}
            </span>
            {mounted && (
              <span className={`btn-label ${open ? "in" : "out"}`}>
                {t("close")}
              </span>
            )}
          </span>
        </button>
      </div>

      {mounted && (
        <div
          id={collapseId}
          className={`collapsible ${mounted && open ? "open" : ""}`}
          aria-hidden={!open}
        >
          <div className="collapsible-inner">
            <div
              className="container padding-y-30-30"
              style={{ paddingBottom: 0 }}
            >
              <div className="row d-flex justify-content-center">
                <div className="col-12 col-md-9 col-xl-6 mb-4">
                  <div className="site-content fz-20 text-center">
                    <p>{t("checkAvailability")}</p>
                    <p className="mt-0 fw-500">{t("sendRequest")}</p>
                  </div>
                </div>
              </div>

              <div className="row d-flex justify-content-center">
                <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
                  <a
                    href={`tel:${phone}`}
                    className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                  >
                    <span>{t("callUs")}</span>
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
                    <span>{t("contactUs")}</span>
                    <span className="btn-filter d-flex align-items-center justify-content-center">
                      <i className="webfont icon-wf-st_chat-wa fz-28 color-black"></i>
                      <span className="btn-filter-hover d-flex align-items-center">
                        <i className="webfont icon-wf-st_chat-wa fz-28 color-white"></i>
                      </span>
                    </span>
                  </a>
                </div>

                <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 my-md-3 my-xl-4">
                  <a
                    href={`mailto:${email}`}
                    className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                  >
                    <span>{t("email")}</span>
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
      )}

      <style jsx>{`
        /* --- Button label crossfade/slide --- */
        .btn-label-wrap {
          position: relative;
          display: inline-block;
          min-width: 6.5ch; /* جلوگیری از پرش عرض دکمه هنگام تعویض متن */
        }
        .btn-label {
          position: absolute;
          inset: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 440ms ease, transform 440ms ease;
        }
        .btn-label.in {
          opacity: 1;
          transform: translateY(0);
        }
        .btn-label.out {
          opacity: 0;
          transform: translateY(-6px);
        }

        /* --- Collapsible (Grid auto-height) --- */
        .collapsible {
          display: grid;
          grid-template-rows: 0fr; /* جمع‌شده */
          transition: grid-template-rows 720ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 600ms ease, transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 0;
          transform: translateY(-6px);
          pointer-events: none; /* در حالت بسته کلیک‌ناپذیر باشد */
          will-change: grid-template-rows, opacity, transform;
        }
        .collapsible.open {
          grid-template-rows: 1fr; /* باز */
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .collapsible-inner {
          overflow: hidden; /* جلوگیری از بیرون‌زدن محتوا در هنگام ترنزیشن */
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .btn-label,
          .collapsible {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
