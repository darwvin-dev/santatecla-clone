"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavMenu from "./NavMenu";
import { LogoFull, LogoH } from "../brand/Logo";

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ setIsMenuOpen, isMenuOpen }: HeaderProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className="navbar py-2 px-0 fixed-top">
        <div className="container-fluid d-flex flex-row flex-wrap flex-lg-nowrap justify-content-between">
          <div
            className="d-flex flex-nowrap flex-row align-items-center justify-content-between"
            style={{ flexGrow: 1 }}
          >
            <div className="hamburger-wrap d-flex align-items-start">
              <button
                id="nav-icon"
                type="button"
                aria-label="Toggle navigation"
                className={isMenuOpen ? "is-open" : ""}
                onClick={() => {
                  if (!isMenuOpen) setIsMenuOpen(true);
                }}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>

            <Link
              className="brand d-inline-flex align-items-center txt-no-underline position-relative"
              href="/"
              aria-label="Santa Tecla Living"
              style={{ gap: 8 }}
            >
              <span
                className="brand-wrap"
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  height: 40, 
                }}
              >
                <LogoFull
                  width={170}
                  height={40}
                  style={{
                    display: "block",
                    transition: "opacity .2s ease, transform .2s ease",
                    opacity: scrolled ? 0 : 1,
                    // transform: scrolled
                    //   ? "translateY(-6px) scale(.96)"
                    //   : "translateY(0) scale(1)",
                    position: scrolled
                      ? ("absolute" as const)
                      : ("static" as const),
                  }}
                />
                <LogoH
                  width={36}
                  height={36}
                  style={{
                    display: "block",
                    transition: "opacity .2s ease, transform .2s ease",
                    opacity: scrolled ? 1 : 0,
                    transform: scrolled
                      ? "translateY(0) scale(1)"
                      : "translateY(6px) scale(.96)",
                  }}
                />
              </span>
            </Link>

            <div className="nav-icn-wrap d-flex flex-row justify-content-end">
              <div
                className="nav-icn-lang d-none d-md-block"
                id="langSwitchDesktop"
              >
                <div id="langSwitch">
                  <div className="wpml-ls-statics-shortcode_actions wpml-ls wpml-ls-touch-device wpml-ls-legacy-dropdown-click js-wpml-ls-legacy-dropdown-click">
                    <ul>
                      <li
                        className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-it wpml-ls-current-language wpml-ls-first-item wpml-ls-item-legacy-dropdown-click"
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                      >
                        <Link
                          href={"#"}
                          className="js-wpml-ls-item-toggle wpml-ls-item-toggle"
                        >
                          <span className="wpml-ls-native">IT</span>
                        </Link>

                        <ul
                          className="js-wpml-ls-sub-menu wpml-ls-sub-menu"
                          style={{
                            visibility: langDropdownOpen ? "visible" : "hidden",
                          }}
                        >
                          <li className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-en wpml-ls-last-item">
                            <Link
                              href="https://www.santateclaliving.com/en/apartments/"
                              className="wpml-ls-link"
                            >
                              <span className="wpml-ls-native" lang="en">
                                EN
                              </span>
                            </Link>
                          </li>
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
    </>
  );
}
