"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavMenu from "./NavMenu";

export default function Header({ setIsMenuOpen, isMenuOpen }) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
              className="brand d-inline-flex flex-column align-items-center txt-no-underline position-relative"
              href="/"
              aria-label="Santa Tecla Living"
            >
              <i className="main-brand webfont icon-wf-st_logo-ponte fz-40 color-black color-black-hover"></i>
              <i
                className="sub-brand webfont icon-wf-st_logo-ST-living fz-150 color-black color-black-hover"
                style={{
                  maxHeight: "60px",
                  opacity: 1,
                }}
              >
                Santa Tecla
              </i>
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
