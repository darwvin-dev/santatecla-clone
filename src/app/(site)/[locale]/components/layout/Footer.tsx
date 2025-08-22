"use client";

import Link from "next/link";
import {useTranslations} from "next-intl";
import React from "react";

export default function Footer() {
  const t = useTranslations("footer");

  // لینک‌های سیاست‌ها (اکسترنال هستن، i18n ندارن)
  const PRIVACY_URL =
    "https://www.santateclaliving.com/wp-content/uploads/2023/03/santa-tecla-living_privacy-policy-1.pdf";
  const COOKIES_URL =
    "https://www.santateclaliving.com/wp-content/uploads/2023/03/santa-tecla-living_cookie-policy-1.pdf";

  return (
    <footer className="site-footer container-fluid padding-y-55-50">
      <div className="row">
        <div className="container">
          <div className="row" style={{flexGrow: 1}}>
            {/* Newsletter */}
            <div className="col-12 col-sm-9 footer-form-wrap mb-5 mb-lg-0 col-xl-4">
              <form method="POST" className="newsletter footer-form">
                <h3 className="contact_form_title footer-newsletter-title footer-title ff-sans fw-400 fz-18 color-white lh-sm">
                  {t("newsletter.title")}
                </h3>

                {/* Hidden fields: اگر سمت سرور می‌گیری، نگه‌شون دار */}
                <input type="hidden" id="security-nl" name="security-nl" value="06d0d3b2b2" />
                <input type="hidden" name="_wp_http_referer" value="/" />
                <input type="hidden" name="action" value="submit_newsletter" />

                <div className="newsletter_inputs">
                  <div className="position-relative">
                    <div className="form-group mb-0">
                      <label className="sr-only" htmlFor="newsletter_email">
                        {t("newsletter.placeholderEmail")}
                      </label>
                      <input
                        id="newsletter_email"
                        name="newsletter_email"
                        className="form-control btn-rounded btn-with-arrow btn-white ff-sans fw-300 fz-16 color-gray-light lh-xs"
                        type="email"
                        placeholder={t("newsletter.placeholderEmail")}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      aria-label={t("newsletter.submitAria")}
                      style={{zIndex: 1}}
                      className="btn btn-arrow btn-white-50 p-0 h-100 d-flex align-items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" aria-hidden="true" focusable="false">
                        <path d="M16.808 3.954l-.707.707L24.439 13H.646v1H24.44l-8.338 8.339.707.707 9.546-9.546z"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="form-group mb-0 mt-1 mt-sm-3 mt-md-2 mt-lg-0">
                    <p className="form-checkbox mb-0 mt-2">
                      <input
                        id="newsletter_privacy"
                        name="newsletter_privacy"
                        aria-label="newsletter_privacy"
                        type="checkbox"
                        value="1"
                        required
                      />
                      <label
                        htmlFor="newsletter_privacy"
                        className="site-content link-white-bold ff-sans fw-200 fz-14 color-white lh-xs"
                      >
                        {t.rich("newsletter.consent", {
                          policy: (chunks) => (
                            <Link href={PRIVACY_URL} target="_blank" rel="noopener nofollow">
                              {chunks || t("newsletter.policy")}
                            </Link>
                          )
                        })}
                      </label>
                    </p>
                  </div>
                </div>

                <div className="newsletter_notice" style={{display: "none"}}>
                  <div className="newsletter_notice_close"></div>
                  <div className="newsletter_notice_message"></div>
                </div>
              </form>
            </div>

            {/* Headquarter */}
            <div className="footer-custom-col footer-headquarter">
              <h3 className="footer-title ff-sans fw-400 fz-18 color-white lh-sm">
                {t("headquarter")}
              </h3>
              <div className="site-content link-white-bold ff-sans fw-200 fz-16 color-white lh-sm">
                <p className="mb-0 mt-0">Sede Via Matteo Bandello 14</p>
                <p className="mb-0 mt-0">20123 Milano</p>
              </div>
            </div>

            {/* Contacts */}
            <div className="footer-custom-col footer-contact footer-design-contact">
              <h3 className="footer-title ff-sans fw-400 fz-18 color-white lh-sm">
                {t("contacts")}
              </h3>
              <div className="d-flex flex-column">
                <a
                  href="tel:+393519361241"
                  className="d-inline-block ff-sans fw-200 fz-16 color-white color-white-hover lh-sm txt-no-underline"
                >
                  +39 351 936 1241
                </a>
                <p className="ff-sans fw-200 fz-16 lh-sm mb-0 mt-0 footer-email">
                  <a href="mailto:habitabioita@gmail.com">habitabioita@gmail.com</a>
                </p>
              </div>

              <ul className="header-channels list-unstyled d-flex flex-row mb-0 mt-3">
                <li className="header-channel">
                  <a
                    href="https://www.instagram.com/habitabioo/profilecard/?igsh=b2x5MHJta2lyb3Iz"
                    className="sch-schannel-is sch-schannel"
                    title="Instagram"
                    target="_blank"
                    rel="noopener nofollow"
                  ></a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-5 w-100 d-flex flex-column flex-xl-row flex-wrap flex-xl-nowrap justify-content-xl-between">
            <div className="d-inline-flex flex-sm-nowrap flex-row align-items-center justify-content-between justify-content-sm-center justify-content-xl-start">
              <Link
                href={COOKIES_URL}
                target="_blank"
                rel="noopener nofollow"
                className="ff-sans fw-300 fz-16 color-white color-white-hover lh-sm text-uppercase txt-no-underline my-2 my-sm-0 mx-sm-4 mx-xl-0"
              >
                {t("cookies")}
              </Link>
              <Link
                href={PRIVACY_URL}
                target="_blank"
                rel="noopener nofollow"
                className="ff-sans fw-300 fz-16 color-white color-white-hover lh-sm text-uppercase txt-no-underline my-2 my-sm-0 mx-sm-4 mr-xl-0 ml-xl-3 ml-xxl-5"
              >
                {t("privacy")}
              </Link>
              <button
                type="button"
                aria-label={t("preferences")}
                data-toggle="modal"
                data-target="#cookie_banner_prefences_box"
                className="btn ff-sans fw-300 fz-16 color-white color-white-hover lh-sm text-uppercase txt-no-underline p-0 my-2 my-sm-0 mx-sm-4 mr-xl-0 ml-xl-3 ml-xxl-5"
              >
                <span>{t("preferences")}</span>
              </button>
            </div>

            <div className="mt-4 mt-xl-0 d-flex flex-column flex-nowrap align-items-center align-items-xl-end justify-content-center justify-content-start">
              <p className="mb-0 ff-sans fw-300 fz-16 color-white-50 color-white-50-hover lh-sm text-center text-xl-left">
                {t("companyLine")}
                <br className="d-md-none" />
                <span className="px-1 d-none d-md-inline">|</span>
                {t("addressLine")}
                <br className="d-sm-none" />
                <span className="px-1 d-none d-sm-inline">|</span>
                {t("vatLine")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
