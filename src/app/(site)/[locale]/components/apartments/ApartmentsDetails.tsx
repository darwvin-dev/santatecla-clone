import { AmenityKey, Apartment } from "@/types/Apartment";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

type Feature = { key: AmenityKey; label: string; icon: string };

const FEATURES: Feature[] = [
  {
    key: "macchina_caffe",
    label: "Macchina del caffè",
    icon: "/features-icon/coffee-machine.svg",
  },
  {
    key: "aria_condizionata",
    label: "Aria condizionata",
    icon: "/features-icon/air-conditioning.svg",
  },
  { key: "bollitore", label: "Bollitore", icon: "/features-icon/kettle.svg" },
  { key: "tostapane", label: "Tostapane", icon: "/features-icon/toaster.svg" },
  {
    key: "lavastoviglie",
    label: "Lavastoviglie",
    icon: "/features-icon/dishwasher.svg",
  },
  {
    key: "self_check_in",
    label: "Self Check-in",
    icon: "/features-icon/self-check-in.svg",
  },
  { key: "tv", label: "TV", icon: "/features-icon/tv.svg" },
  {
    key: "lavatrice",
    label: "Lavatrice",
    icon: "/features-icon/lavatrice.svg",
  },
  {
    key: "set_di_cortesia",
    label: "Set di cortesia",
    icon: "/features-icon/set-di-cortesia.svg",
  },
  {
    key: "microonde",
    label: "Microonde",
    icon: "/features-icon/microonde.svg",
  },
  {
    key: "biancheria",
    label: "Biancheria",
    icon: "/features-icon/biancheria.svg",
  },
  {
    key: "culla_su_richiesta",
    label: "Culla su richiesta",
    icon: "/features-icon/culla-su-richiesta.svg",
  },
  { key: "wifi", label: "WiFi", icon: "/features-icon/wifi.svg" },
  {
    key: "parcheggio_esterno",
    label: "Parcheggio esterno",
    icon: "/features-icon/parcheggio-esterno.svg",
  },
  {
    key: "animali_ammessi",
    label: "Animali ammessi",
    icon: "/features-icon/animali-ammessi.svg",
  },
  {
    key: "asciugacapelli",
    label: "Asciugacapelli",
    icon: "/features-icon/asciugacapelli.svg",
  },
  { key: "balcone", label: "Balcone", icon: "/features-icon/balcone.svg" },
];

export default function ApartmentsDetails({ data }: { data: Apartment }) {
  const t = useTranslations("apartments");
  const locale = useLocale();

  const {
    title,
    address,
    address_en,
    description,
    description_en,
    guests,
    sizeSqm,
    floor,
    floor_en,
    bathrooms,
    amenities = [],
    plan,
    cir,
    cin,
  } = data || {};

  const selectedFeatures = FEATURES.filter((f) => amenities.includes(f.key));

  const mailSubject = encodeURIComponent(
    `Richiedi info per ${title ?? "appartamento"}`
  );
  const mailBody = encodeURIComponent(
    `Salve, sono interessato a ricevere informazioni sull’appartamento: ${
      title ?? ""
    }.`
  );
  const waText = encodeURIComponent(
    `Salve, sono interessato a ricevere informazioni sull’appartamento: ${
      title ?? ""
    }.`
  );

  return (
    <section className="row padding-y-100-100 info-wrap-property">
      <div className="container">
        <div className="row mb-md-5">
          <div className="col-12 col-lg-5">
            <p className="ff-sans fw-400 fz-21 color-black lh-sm">
              {locale === "en"
                ? address_en || address
                : address || ""}
            </p>

            <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm padding-y-0-40">
              <div style={{whiteSpace: "pre-line"}}>
                {locale === "en"
                ? description_en || description
                : description || ""}
              </div>
              <p>&nbsp;</p>
              <p>
                CIR: {cir}
                <br />
                CIN: {cin}
              </p>
            </div>

            <div className="row">
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">
                  {t("card.guests")}
                </p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {guests ?? "-"}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">
                  {t("apartment.superficie")}
                </p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {typeof sizeSqm === "number"
                    ? `${sizeSqm} ${t("card.sqm")}`
                    : "-"}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">
                  {t("card.floor")}
                </p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {locale === "en"
                ? floor_en || floor
                : floor || ""}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">
                  {t("card.bathrooms")}
                </p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {bathrooms ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div
            className="col-12 col-lg-6 offset-lg-1"
            style={{ marginTop: 37 }}
          >
            <div className="row">
              {selectedFeatures.map((f) => (
                <div
                  key={f.key}
                  className="col-12 col-sm-6 col-md-4 col-lg-6 mt-3 d-flex flex-row align-items-center"
                >
                  <span className="features-icon" aria-hidden="true">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_DOMAIN_ADDRESS}${f.icon}`}
                      alt={f.label}
                      width={28}
                      height={28}
                      loading="lazy"
                    />
                  </span>
                  <span className="ff-sans fw-400 fz-18 color-black lh-sm pl-3">
                    {t(`amenities.${f.key}`)}
                  </span>
                </div>
              ))}
              {selectedFeatures.length === 0 && (
                <div className="col-12 mt-3">
                  <span className="ff-sans fz-16 color-gray">
                    Nessuna dotazione selezionata.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row d-flex flex-row justify-content-center padding-y-90-90 mb-md-5">
          <div className="col-12 col-md-11 col-lg-9 col-xl-10 col-xxl-8">
            <div className="row d-flex flex-row justify-content-center single-property-files">
              {plan && (
                <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                  <a
                    href={plan}
                    target="_blank"
                    rel="nofollow noopener"
                    className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                  >
                    <span>{t("actions.plan")}</span>
                    <span className="btn-filter d-flex align-items-center justify-content-center">
                      <i className="webfont icon-wf-st_planimetria fz-28 color-black" />
                      <span className="btn-filter-hover d-flex align-items-center">
                        <i className="webfont icon-wf-st_planimetria fz-28 color-white" />
                      </span>
                    </span>
                  </a>
                </div>
              )}

              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4 single-property-email">
                <a
                  href={`mailto:reservation@santateclaliving.com?subject=${mailSubject}&body=${mailBody}`}
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>{t("actions.requestInfo")}</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chiedi-info fz-28 color-black" />
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chiedi-info fz-28 color-white" />
                    </span>
                  </span>
                </a>
              </div>

              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                <a
                  href="tel:+393519361241"
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>{t("actions.callUs")}</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chiama-tel fz-28 color-black" />
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chiama-tel fz-28 color-white" />
                    </span>
                  </span>
                </a>
              </div>

              <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                <a
                  href={`https://wa.me/393519361241?text=${waText}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                >
                  <span>{t("actions.contactUs")}</span>
                  <span className="btn-filter d-flex align-items-center justify-content-center">
                    <i className="webfont icon-wf-st_chat-wa fz-28 color-black" />
                    <span className="btn-filter-hover d-flex align-items-center">
                      <i className="webfont icon-wf-st_chat-wa fz-28 color-white" />
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
