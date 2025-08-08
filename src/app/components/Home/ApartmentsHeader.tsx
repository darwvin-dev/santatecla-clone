"use client";
import React, { useState } from "react";

export default function ApartmentsHeader() {
  const [order, setOrder] = useState("date_desc");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value);
    console.log("Order changed to:", e.target.value);
  };

  return (
    <div className="container padding-y-100-100 archive-prop-intro">
      <div className="row d-flex justify-content-center justify-content-xl-start">
        <div className="col-12 col-xl-5">
          <h1 className="sr-only">Corti di Bayres 4</h1>
          <h2 className="mb-0 ff-sans fw-400 fz-32 color-black lh-xs">
            I nostri appartamenti{" "}
          </h2>
        </div>
        <div className="archive-filter-wrap filter-order ml-auto">
          <form
            role="search"
            method="get"
            action="https://www.santateclaliving.com/apartments/"
            id="order_filter"
            className="cta-filter-archive"
          >
            <select
              name="propsearch_order"
              id="propsearch_order"
              style={{ paddingBlock: "5px", cursor: "pointer" }}
              className="d-inline-block ff-sans fw-300 fz-20 color-black color-black-hover lh-xs txt-no-underline"
            >
              <option disabled={true}>Ordina per:</option>
              <option value="date_desc">Più recenti</option>
              <option value="date_asc">Meno recenti </option>
            </select>
            <div className="sr-only">
              <button type="submit">Filtra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
