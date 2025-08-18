import React from "react";

export default function HomeAbout() {
  return (
    <section className="row padding-y-90-90 prop-section-about">
      <div className="w-100 position-relative overflow-hidden property-about-container">
        <div className="container h-100">
          <div className="row h-100">
            <div
              className="col-12 col-md-6 col-lg-6 prop-about-img-wrap"
            >
              <div className="prop-about-img prop-minheight-img">
                <figure className="mb-0">
                  <img
                    data-src="/images/soggiorno_dettaglio_5-1920x1280.jpg"
                    alt=""
                    width="1920"
                    height="1280"
                    className="img-fluid lazy entered loaded"
                    data-ll-status="loaded"
                    src="/images/soggiorno_dettaglio_5-1920x1280.jpg"
                  />
                </figure>
              </div>
            </div>
            <div className="property-about-text col-12 col-md-6 col-lg-5 offset-lg-1 d-flex flex-column justify-content-between">
              <div>
                <h2 className="mb-0 padding-y-0-40 ff-sans fw-400 fz-32 color-black lh-sm">
                  Un' ospitalità straordinaria{" "}
                </h2>
                <div className="site-content link-black ff-sans fw-200 fz-18 color-gray lh-sm">
                  <p>
                    Cosa ci fa sentire bene quando soggiorniamo lontano da casa?
                    È quella sensazione di comfort e familiarità che ci mette a
                    proprio agio come a casa nostra. Vogliamo offrirti i servizi
                    e l’accoglienza di un hotel nella privacy di un
                    appartamento, per un soggiorno business, leisure o in
                    famiglia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
