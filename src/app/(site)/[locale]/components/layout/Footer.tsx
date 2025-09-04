"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="site-footer container-fluid padding-y-55-50">
      <div className="row">
        <div className="container">
          <div className="row" style={{ flexGrow: 1 }}>

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
                <a
                  href="https://wa.me/393519361241"
                  className="d-inline-block ff-sans fw-200 fz-16 color-white color-white-hover lh-sm txt-no-underline mt-1"
                  target="_blank"
                  rel="noopener nofollow"
                >
                  WhatsApp
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

            {/* Quick Links */}
            <div className="footer-custom-col footer-quick-links">
              <h3 className="footer-title ff-sans fw-400 fz-18 color-white lh-sm">
                {t("linksTitle")}
              </h3>
              <ul className="list-unstyled ff-sans fw-200 fz-16 color-white lh-sm">
                <li className="mb-1"><Link href="/">{t("home")}</Link></li>
                {/* <li className="mb-1"><Link href="/about">{t("about")}</Link></li> */}
                <li className="mb-1"><Link href="/apartments">{t("apartments")}</Link></li>
                <li className="mb-1"><Link href="/gestione">{t("gestione")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-5 w-100 d-flex flex-column flex-xl-row flex-wrap flex-xl-nowrap justify-content-xl-between">
            <div className="d-inline-flex flex-sm-nowrap flex-row align-items-center justify-content-between justify-content-sm-center justify-content-xl-start">
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
