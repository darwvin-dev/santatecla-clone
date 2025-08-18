export default function HeroSection() {
  return (
    <section className="row property-intro-wrap">
      <h1 className="sr-only color-white">Home</h1>
      <div
        style={{
          backgroundImage: "url(/images/soggiorno_2-1920x1281.jpg)",
        }}
        className="living-intro-background set-background-img vw-100 d-none d-md-flex align-items-center justify-content-center position-relative"
      >
        <div className="overlay-black-20"></div>
        <div className="col-12 col-sm-10 col-lg-7 col-xl-6 col-xxl-5">
          <h2 className="homepage-title mb-0 ff-sans fw-200 fz-60 color-white lh-xs text-center">
            La tua casa
            <br />
            lontano da casa{" "}
          </h2>
        </div>
      </div>
      <div
        style={{
          backgroundImage: "url(/images/soggiorno_2-crop-mobile.jpg)",
          backgroundPosition: "center left",
        }}
        className="living-intro-background set-background-img vw-100 d-flex d-md-none align-items-center justify-content-center position-relative"
      >
        <div className="overlay-black-20"></div>
        <div className="col-12 col-sm-10 col-lg-7 col-xl-6 col-xxl-5">
          <h2
            className="homepage-title mb-0 ff-sans fw-200 fz-60 color-white lh-xs text-center"
            style={{ zIndex: 1 }}
          >
            La tua casa
            <br />
            lontano da casa{" "}
          </h2>
        </div>
      </div>
    </section>
  );
}
