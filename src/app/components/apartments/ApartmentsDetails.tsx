// ApartmentsDetails.tsx
import Image from "next/image";
import React from "react";

type AmenityKey =
  | "macchina_caffe"
  | "aria_condizionata"
  | "bollitore"
  | "tostapane"
  | "lavastoviglie"
  | "self_check_in"
  | "tv"
  | "lavatrice"
  | "set_di_cortesia"
  | "microonde"
  | "biancheria"
  | "culla_su_richiesta"
  | "wifi"
  | "parcheggio_esterno"
  | "animali_ammessi"
  | "asciugacapelli"
  | "balcone";

type Feature = { key: AmenityKey; label: string; icon: string };

const FEATURES: Feature[] = [
  { key: "macchina_caffe", label: "Macchina del caffè", icon: "/features-icon/coffee-machine.svg" },
  { key: "aria_condizionata", label: "Aria condizionata", icon: "/features-icon/air-conditioning.svg" },
  { key: "bollitore", label: "Bollitore", icon: "/features-icon/kettle.svg" },
  { key: "tostapane", label: "Tostapane", icon: "/features-icon/toaster.svg" },
  { key: "lavastoviglie", label: "Lavastoviglie", icon: "/features-icon/dishwasher.svg" },
  { key: "self_check_in", label: "Self Check-in", icon: "/features-icon/self-check-in.svg" },
  { key: "tv", label: "TV", icon: "/features-icon/tv.svg" },
  { key: "lavatrice", label: "Lavatrice", icon: "/features-icon/lavatrice.svg" },
  { key: "set_di_cortesia", label: "Set di cortesia", icon: "/features-icon/set-di-cortesia.svg" },
  { key: "microonde", label: "Microonde", icon: "/features-icon/microonde.svg" },
  { key: "biancheria", label: "Biancheria", icon: "/features-icon/biancheria.svg" },
  { key: "culla_su_richiesta", label: "Culla su richiesta", icon: "/features-icon/culla-su-richiesta.svg" },
  { key: "wifi", label: "WiFi", icon: "/features-icon/wifi.svg" },
  { key: "parcheggio_esterno", label: "Parcheggio esterno", icon: "/features-icon/parcheggio-esterno.svg" },
  { key: "animali_ammessi", label: "Animali ammessi", icon: "/features-icon/animali-ammessi.svg" },
  { key: "asciugacapelli", label: "Asciugacapelli", icon: "/features-icon/asciugacapelli.svg" },
  { key: "balcone", label: "Balcone", icon: "/features-icon/balcone.svg" },
];

type ApartmentsDetailsProps = {
  data: {
    title?: string;
    address?: string;
    details?: string; // HTML از ادمین
    guests?: number;
    sizeSqm?: number;
    floor?: string;
    bathrooms?: number;
    amenities?: AmenityKey[]; // آرایه کلیدها
    plan?: string | null; // مسیر تصویر پلان (اختیاری)
  };
};

export default function ApartmentsDetails({ data }: ApartmentsDetailsProps) {
  const {
    title,
    address,
    details,
    guests,
    sizeSqm,
    floor,
    bathrooms,
    amenities = [],
    plan,
  } = data || {};

  const selectedFeatures = FEATURES.filter((f) => amenities.includes(f.key));

  const mailSubject = encodeURIComponent(`Richiedi info per ${title ?? "appartamento"}`);
  const mailBody = encodeURIComponent(
    `Salve, sono interessato a ricevere informazioni sull’appartamento: ${title ?? ""}.`
  );
  const waText = encodeURIComponent(
    `Salve, sono interessato a ricevere informazioni sull’appartamento: ${title ?? ""}.`
  );

  return (
    <section className="row padding-y-100-100 info-wrap-property">
      <div className="container">
        <div className="row mb-md-5">
          <div className="col-12 col-lg-5">
            <p className="ff-sans fw-400 fz-21 color-black lh-sm">
              {address || ""}
            </p>

            <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm padding-y-0-40">
              {details ? (
                <div dangerouslySetInnerHTML={{ __html: details }} />
              ) : null}
              <p>&nbsp;</p>
              <p>
                CIR: 015146-CIM-05557
                <br />
                CIN: IT015146B4VIB7FRTT
              </p>
            </div>

            <div className="row">
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Ospiti</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {guests ?? "-"}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Superficie</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {typeof sizeSqm === "number" ? `${sizeSqm} mq` : "-"}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Piano</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {floor || "-"}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-6 mb-2">
                <p className="mb-0 ff-sans fw-400 fz-21 color-black lh-xs">Bagni</p>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  {bathrooms ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="col-12 col-lg-6 offset-lg-1" style={{ marginTop: 37 }}>
            <div className="row">
              {selectedFeatures.map((f) => (
                <div
                  key={f.key}
                  className="col-12 col-sm-6 col-md-4 col-lg-6 mt-3 d-flex flex-row align-items-center"
                >
                  <span className="features-icon" aria-hidden="true">
                    <Image src={f.icon} alt={f.label} width={28} height={28} loading="lazy" />
                  </span>
                  <span className="ff-sans fw-400 fz-18 color-black lh-sm pl-3">{f.label}</span>
                </div>
              ))}
              {selectedFeatures.length === 0 && (
                <div className="col-12 mt-3">
                  <span className="ff-sans fz-16 color-gray">Nessuna dotazione selezionata.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Links */}
        <div className="row d-flex flex-row justify-content-center padding-y-90-90 mb-md-5">
          <div className="col-12 col-md-11 col-lg-9 col-xl-10 col-xxl-8">
            <div className="row d-flex flex-row justify-content-center single-property-files">
              {/* Planimetria: فقط اگر داده موجود بود */}
              {plan && (
                <div className="col-10 col-sm-6 col-md-4 col-xl-3 my-2 my-md-3 my-xl-4">
                  <a
                    href={plan}
                    target="_blank"
                    rel="nofollow noopener"
                    className="w-100 position-relative d-inline-flex align-items-center btn-rounded btn-with-arrow btn-black ff-sans fw-300 fz-20 color-black color-white-hover lh-xs txt-no-underline"
                  >
                    <span>Planimetria</span>
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
                  <span>Richiedi info</span>
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
                  <span>Chiamaci</span>
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
                  <span>Contattaci</span>
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
