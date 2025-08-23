"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

type Order = "date_desc" | "date_asc" | "alpha_asc" | "alpha_desc";

export default function ApartmentsHeader({
  order,
  setOrder,
}: {
  order: Order;
  setOrder: (v: Order) => void;
}) {
  const t = useTranslations("apartments.header");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as Order);
  };

  return (
    <div className="container padding-y-100-100 archive-prop-intro">
      <div className="row d-flex justify-content-center justify-content-xl-start">
        <div className="col-12 col-xl-5">
          <h1 className="sr-only">Corti di Bayres 4</h1>
          <h2 className="mb-0 ff-sans fw-400 fz-32 color-black lh-xs">
            {t("title")}
          </h2>
        </div>
        <div className="archive-filter-wrap filter-order ml-auto">
          <form role="search" id="order_filter" className="cta-filter-archive">
            <select
              name="order"
              id="propsearch_order"
              value={order}
              onChange={handleChange}
              style={{ paddingBlock: "5px", cursor: "pointer" }}
              className="d-inline-block ff-sans fw-300 fz-20 color-black color-black-hover lh-xs txt-no-underline"
            >
              <option disabled>{t("orderBy")}:</option>
              <option value="date_desc">{t("newest")}</option>
              <option value="date_asc">{t("oldest")}</option>
              <option value="alpha_asc">A → Z</option>
              <option value="alpha_desc">Z → A</option>
            </select>
            <div className="sr-only">
              <button type="submit">{t("filter")}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
