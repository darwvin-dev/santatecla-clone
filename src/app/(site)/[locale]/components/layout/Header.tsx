"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoFull, LogoH } from "../brand/Logo";
import { Link } from "@/i18n/navigation";

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Locale = "it" | "en";

function splitLocale(pathname: string): { locale: Locale; rest: string } {
  const pathOnly = pathname.split("#")[0].split("?")[0];
  const segs = pathOnly.split("/").filter(Boolean);
  const first = (segs[0] as Locale) || "it";
  const isLocale = first === "it" || first === "en";
  const locale: Locale = isLocale ? first : "it";
  const rest = "/" + (isLocale ? segs.slice(1).join("/") : segs.join("/"));
  return { locale, rest: rest === "//" ? "/" : rest };
}

export default function Header({ setIsMenuOpen, isMenuOpen }: HeaderProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [invert, setInvert] = useState(false);
  const pathname = usePathname();
  const { locale, rest } = useMemo(() => splitLocale(pathname), [pathname]);
  const allowInvert = rest === "/" || rest.startsWith("/gestione");

  // تاخیر امن برای دکمه همبرگری
  const openTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (openTimer.current) {
        window.clearTimeout(openTimer.current);
        openTimer.current = null;
      }
    };
  }, []);

  // محاسبه invert/scrolled (مثل قبل)
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("nav.navbar");
    const navH = nav?.offsetHeight ?? 80;
    const sentinel =
      (allowInvert &&
        (document.getElementById("hero-end-sentinel") ||
          document.querySelector<HTMLElement>("[data-hero-end]"))) ||
      null;

    const recompute = () => {
      if (allowInvert && sentinel) {
        const top = sentinel.getBoundingClientRect().top;
        const passed = top <= navH;
        setScrolled(passed);
        setInvert(!passed);
      } else {
        const y = document.scrollingElement?.scrollTop ?? window.scrollY ?? 0;
        setScrolled(y > 8);
        setInvert(false);
      }
    };

    const events: Array<keyof WindowEventMap> = [
      "scroll",
      "resize",
      "orientationchange",
      "pageshow",
    ];
    recompute();
    events.forEach((ev) => window.addEventListener(ev, recompute, { passive: true }));
    (window as any).visualViewport?.addEventListener("resize", recompute);
    (window as any).visualViewport?.addEventListener("scroll", recompute);
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, recompute));
      (window as any).visualViewport?.removeEventListener("resize", recompute);
      (window as any).visualViewport?.removeEventListener("scroll", recompute);
    };
  }, [allowInvert, pathname]);

  // لینک‌های تعویض زبان (اختیاری: منو رو ببند)
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className={`navbar py-2 px-0 mt-2 fixed-top ${invert ? "navbar--invert" : ""}`}>
        <div className="container-fluid d-flex flex-row flex-wrap flex-lg-nowrap justify-content-between">
          <div className="navbar-header d-flex flex-nowrap flex-row align-items-center align-items-md-start justify-content-between" style={{ flexGrow: 1 }}>
            <div className="hamburger-wrap d-flex align-items-start">
              <button
                id="nav-icon"
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={isMenuOpen}
                className={isMenuOpen ? "is-open" : ""}
                onClick={() => {
                  if (openTimer.current) return;
                  openTimer.current = window.setTimeout(() => {
                    setIsMenuOpen((v) => !v);
                    openTimer.current = null;
                  }, 120);
                }}
              >
                <span></span><span></span><span></span><span></span>
              </button>
            </div>

            <Link
              className="brand d-inline-flex align-items-center txt-no-underline position-relative"
              href={"/"}
              aria-label="Santa Tecla Living"
              style={{ gap: 8 }}
              onClick={closeMenu}
            >
              <span className="brand-wrap" style={{ display: "inline-grid", placeItems: "center", height: 40 }}>
                <LogoFull
                  width={180}
                  height={50}
                  style={{
                    display: "block",
                    transition: "opacity .2s ease, transform .2s ease",
                    // opacity: scrolled ? 0 : 1,
                    // position: scrolled ? ("absolute" as const) : ("static" as const),
                  }}
                />
                {/* <LogoH
                  width={55}
                  height={55}
                  style={{
                    display: "block",
                    transition: "opacity .2s ease, transform .2s ease",
                    opacity: scrolled ? 1 : 0,
                    transform: scrolled ? "translateY(0) scale(1)" : "translateY(6px) scale(.96)",
                  }}
                /> */}
              </span>
            </Link>

            <div className="nav-icn-wrap d-flex flex-row justify-content-end">
              <div className="nav-icn-lang d-none d-md-block" id="langSwitchDesktop">
                <div id="langSwitch">
                  <div className="wpml-ls-statics-shortcode_actions wpml-ls wpml-ls-touch-device wpml-ls-legacy-dropdown-click js-wpml-ls-legacy-dropdown-click">
                    <ul>
                      <li
                        className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-it wpml-ls-current-language wpml-ls-first-item wpml-ls-item-legacy-dropdown-click"
                        onClick={() => setLangDropdownOpen((v) => !v)}
                      >
                        <button
                          type="button"
                          className="js-wpml-ls-item-toggle wpml-ls-item-toggle"
                          style={{ background: "transparent", border: 0, color: "inherit" }}
                          aria-haspopup="listbox"
                          aria-expanded={langDropdownOpen}
                        >
                          <span className="wpml-ls-native">{locale.toUpperCase()}</span>
                        </button>

                        <ul
                          className="js-wpml-ls-sub-menu wpml-ls-sub-menu"
                          style={{ visibility: langDropdownOpen ? "visible" : "hidden" }}
                          role="listbox"
                        >
                          {locale !== "it" && (
                            <li className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-it">
                              <Link href={rest === "/" ? "/" : rest} locale="it" className="wpml-ls-link" onClick={closeMenu}>
                                <span className="wpml-ls-native" lang="it">IT</span>
                              </Link>
                            </li>
                          )}
                          {locale !== "en" && (
                            <li className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-en">
                              <Link href={rest} locale="en" className="wpml-ls-link" onClick={closeMenu}>
                                <span className="wpml-ls-native" lang="en">EN</span>
                              </Link>
                            </li>
                          )}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .navbar { --ink:#0f172a; --accent:#16a34a; }
        .navbar .container-fluid { align-items:center; }
        .brand svg { display:block; }
        #nav-icon span { background:var(--ink); }

        .navbar--invert {
          --ink:#fff; --accent:#fff;
          background:transparent; backdrop-filter:none; box-shadow:none;
        }
        .navbar--invert .color-black,
        .navbar--invert .color-black-hover,
        .navbar--invert .btn-black,
        .navbar--invert .only-arrow-black,
        .navbar--invert .wpml-ls-item-toggle,
        .navbar--invert .wpml-ls-link {
          color:#fff !important;
          border-color:rgba(255,255,255,.7) !important;
        }
        .navbar--invert .only-arrow-black svg path { fill:#fff !important; }
        .navbar--invert #nav-icon span { background:#fff; }
      `}</style>
    </>
  );
}
