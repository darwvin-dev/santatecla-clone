"use client";

import React, { Ref } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

type NavMenuProps = {
  isMenuOpen: boolean;
  menuRef: React.RefObject<HTMLElement | null>; 
};

export default function NavMenu({ isMenuOpen, menuRef }: NavMenuProps) {
  const pathname = usePathname();

  const links = [
    { href: "/apartments", label: "Appartamenti", id: "menu-item-4600" },
    { href: "/gestione", label: "Gestione", id: "menu-item-4604" },
  ];

  return (
    <nav
      className={`site-navigation ${isMenuOpen ? "is-open" : ""}`}
      id="siteNavigation"
      ref={menuRef}
    >
      <div id="container_id" className="container-class">
        <ul id="siteMenu" className="navbar-nav">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.id}
                id={link.id}
                className={`menu-item nav-item ${
                  isActive ? "current-menu-item active" : ""
                }`}
              >
                <Link
                  href={link.href}
                  className="nav-link"
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* زبان */}
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
                      href="/en"
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
      </div>
    </nav>
  );
}
