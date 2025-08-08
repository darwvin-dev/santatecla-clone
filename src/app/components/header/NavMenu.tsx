import React from "react";
import Link from "next/link";

export default function NavMenu() {
  return (
    <nav className="site-navigation is-open" id="siteNavigation">
      <div id="container_id" className="container-class">
        <ul id="siteMenu" className="navbar-nav">
          <li
            id="menu-item-4600"
            className="menu-item menu-item-type-post_type_archive menu-item-object-apartment current-menu-item active menu-item-4600 nav-item"
          >
            <Link href="/apartments/" className="nav-link" aria-current="page">
              <span>Appartamenti</span>
            </Link>
          </li>
          <li
            id="menu-item-4604"
            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4604 nav-item"
          >
            <Link href="/gestione/" className="nav-link">
              <span>Gestione</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-icn-lang d-md-none" id="langSwitchMobile">
        <div id="langSwitch">
          <div className="wpml-ls-statics-shortcode_actions wpml-ls wpml-ls-legacy-dropdown-click js-wpml-ls-legacy-dropdown-click">
            <ul>
              <li className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-it wpml-ls-current-language wpml-ls-first-item wpml-ls-item-legacy-dropdown-click">
                <a
                  href="#"
                  className="js-wpml-ls-item-toggle wpml-ls-item-toggle"
                >
                  <span className="wpml-ls-native">IT</span>
                </a>

                <ul className="js-wpml-ls-sub-menu wpml-ls-sub-menu">
                  <li className="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-en wpml-ls-last-item">
                    <a
                      href="https://www.santateclaliving.com/en/apartments/"
                      className="wpml-ls-link"
                    >
                      <span className="wpml-ls-native" lang="en">
                        EN
                      </span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>{" "}
    </nav>
  );
}
