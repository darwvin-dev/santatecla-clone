"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer container-fluid padding-y-55-50">
      <div className="row">
        <div className="container">
          <div className="row" style={{ flexGrow: 1 }}>
            <div className="col-12 col-sm-9 footer-form-wrap mb-5 mb-lg-0 col-xl-4">
              <form method="POST" className="newsletter footer-form">
                <h3 className="contact_form_title footer-newsletter-title footer-title ff-sans fw-400 fz-18 color-white lh-sm">
                  Iscriviti alla nostra newsletter
                </h3>
                <input type="hidden" id="security-nl" name="security-nl" value="06d0d3b2b2" />
                <input type="hidden" name="_wp_http_referer" value="/" />
                <input type="hidden" name="action" value="submit_newsletter" />

                <div className="newsletter_inputs">
                  <div className="position-relative">
                    <div className="form-group mb-0">
                      <label className="sr-only" htmlFor="newsletter_email"></label>
                      <input
                        id="newsletter_email"
                        name="newsletter_email"
                        className="form-control btn-rounded btn-with-arrow btn-white ff-sans fw-300 fz-16 color-gray-light lh-xs"
                        type="email"
                        placeholder="Email"
                      />
                    </div>
                    <button
                      type="submit"
                      aria-label="Invia"
                      style={{ zIndex: 1 }}
                      className="btn btn-arrow btn-white-50 p-0 h-100 d-flex align-items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27">
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
                      />
                      <label
                        htmlFor="newsletter_privacy"
                        className="site-content link-white-bold ff-sans fw-200 fz-14 color-white lh-xs"
                      >
                        Ho letto e accetto la{" "}
                        <Link
                          href="https://www.santateclaliving.com/wp-content/uploads/2023/03/santa-tecla-living_privacy-policy-1.pdf"
                          target="_blank"
                          rel="noopener nofollow"
                        >
                          Privacy policy
                        </Link>
                      </label>
                    </p>
                  </div>
                </div>

                <div className="newsletter_notice" style={{ display: "none" }}>
                  <div className="newsletter_notice_close"></div>
                  <div className="newsletter_notice_message"></div>
                </div>
              </form>
            </div>

            {/* Headquarter */}
            <div className="footer-custom-col footer-headquarter">
              <h3 className="footer-title ff-sans fw-400 fz-18 color-white lh-sm">Headquarter</h3>
              <div className="site-content link-white-bold ff-sans fw-200 fz-16 color-white lh-sm">
                <p className="mb-0 mt-0">Largo 5° Alpini, 12</p>
                <p className="mb-0 mt-0">20145 Milano</p>
              </div>
            </div>

            {/* Contact */}
            <div className="footer-custom-col footer-contact footer-design-contact">
              <h3 className="footer-title ff-sans fw-400 fz-18 color-white lh-sm">Contatti</h3>
              <div className="d-flex flex-column">
                <a
                  href="tel:+393519361241"
                  className="d-inline-block ff-sans fw-200 fz-16 color-white color-white-hover lh-sm txt-no-underline"
                >
                  +39 351 936 1241
                </a>
                <p className="ff-sans fw-200 fz-16 lh-sm mb-0 mt-0 footer-email">
                  <a href="mailto:reservation@santateclaliving.com">
                    reservation@santateclaliving.com
                  </a>
                </p>
              </div>

              <ul className="header-channels list-unstyled d-flex flex-row mb-0 mt-3">
                <li className="header-channel">
                  <a
                    href="https://www.facebook.com/santateclaimmobiliare"
                    className="sch-schannel-fb sch-schannel"
                    title="Facebook"
                    target="_blank"
                    rel="noopener nofollow"
                  ></a>
                </li>
                <li className="header-channel">
                  <a
                    href="https://www.instagram.com/santatecla_immobiliare"
                    className="sch-schannel-is sch-schannel"
                    title="Instagram"
                    target="_blank"
                    rel="noopener nofollow"
                  ></a>
                </li>
                <li className="header-channel">
                  <a
                    href="https://www.linkedin.com/company/santateclaimmobiliare"
                    className="sch-schannel-in sch-schannel"
                    title="LinkedIn"
                    target="_blank"
                    rel="noopener nofollow"
                  ></a>
                </li>
                <li className="header-channel">
                  <a
                    href="https://www.youtube.com/c/SantateclaImmobiliareMilano"
                    className="sch-schannel-yt sch-schannel"
                    title="YouTube"
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
                href="https://www.santateclaliving.com/wp-content/uploads/2023/03/santa-tecla-living_cookie-policy-1.pdf"
                target="_blank"
                rel="noopener nofollow"
                className="ff-sans fw-300 fz-16 color-white color-white-hover lh-sm text-uppercase txt-no-underline my-2 my-sm-0 mx-sm-4 mx-xl-0"
              >
                Cookies policy
              </Link>
              <Link
                href="https://www.santateclaliving.com/wp-content/uploads/2023/03/santa-tecla-living_privacy-policy-1.pdf"
                target="_blank"
                rel="noopener nofollow"
                className="ff-sans fw-300 fz-16 color-white color-white-hover lh-sm text-uppercase txt-no-underline my-2 my-sm-0 mx-sm-4 mr-xl-0 ml-xl-3 ml-xxl-5"
              >
                Privacy
              </Link>
              <button
                type="button"
                aria-label="Preferenze"
                data-toggle="modal"
                data-target="#cookie_banner_prefences_box"
                className="btn ff-sans fw-300 fz-16 color-white color-white-hover lh-sm text-uppercase txt-no-underline p-0 my-2 my-sm-0 mx-sm-4 mr-xl-0 ml-xl-3 ml-xxl-5"
              >
                <span>Preferenze</span>
              </button>
            </div>

            <div className="mt-4 mt-xl-0 d-flex flex-column flex-nowrap align-items-center align-items-xl-end justify-content-center justify-content-start">
              <p className="mb-0 ff-sans fw-300 fz-16 color-white-50 color-white-50-hover lh-sm text-center text-xl-left">
                Santa Tecla Living
                <br className="d-md-none" />
                <span className="px-1 d-none d-md-inline">|</span>
                Largo 5° Alpini, 12 - 20145 Milano
                <br className="d-sm-none" />
                <span className="px-1 d-none d-sm-inline">|</span>
                P.Iva 09314590960
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
