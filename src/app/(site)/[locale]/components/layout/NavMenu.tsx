"use client";

import React, {useEffect} from "react";
import {usePathname} from "next/navigation";
import {Link} from "@/i18n/navigation";

type Locale = "it" | "en";

type NavMenuProps = {
  isMenuOpen: boolean;
  menuRef: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
};

function splitLocale(pathname: string): { locale: Locale; rest: string } {
  const pathOnly = pathname.split("#")[0].split("?")[0];
  const segs = pathOnly.split("/").filter(Boolean);
  const first = (segs[0] as Locale) || "it";
  const isLocale = first === "it" || first === "en";
  const locale: Locale = isLocale ? first : "it";
  const rest = "/" + (isLocale ? segs.slice(1).join("/") : segs.join("/"));
  return { locale, rest: rest === "//" ? "/" : rest };
}

function normalizeIgnoringLocale(pathname: string): string {
  const {rest} = splitLocale(pathname);
  const trimmed = rest !== "/" && rest.endsWith("/") ? rest.slice(0, -1) : rest;
  return trimmed || "/";
}

const LABELS: Record<Locale, Record<"apartments" | "gestione", string>> = {
  it: {
    apartments: "Appartamenti",
    gestione: "Gestione",
  },
  en: {
    apartments: "Apartments",
    gestione: "Management",
  },
};

export default function NavMenu({isMenuOpen, menuRef, onClose}: NavMenuProps) {
  const pathname = usePathname();
  const {locale, rest} = splitLocale(pathname);

  useEffect(() => {
    const el = menuRef.current as HTMLElement | null;
    if (!el) return;
    if (!isMenuOpen) {
      el.setAttribute("aria-hidden", "true");
      el.inert = true;
    } else {
      el.removeAttribute("aria-hidden");
      el.inert = false;
    }
  }, [isMenuOpen, menuRef]);

  const items = [
    {href: "/apartments", key: "apartments" as const, id: "menu-item-4600"},
    {href: "/gestione", key: "gestione" as const, id: "menu-item-4604"},
  ];

  const current = normalizeIgnoringLocale(pathname);

  const otherLocale: Locale = locale === "it" ? "en" : "it";

  return (
    <nav
      className={`site-navigation ${isMenuOpen ? "is-open" : ""}`}
      id="siteNavigation"
      ref={menuRef}
      role="navigation"
      aria-label="Main"
    >
      <div id="container_id" className="container-class">
        <ul id="siteMenu" className="navbar-nav">
          {items.map((link) => {
            const target = normalizeIgnoringLocale(link.href);
            const isActive = current === target || current.startsWith(target + "/");
            return (
              <li
                key={link.id}
                id={link.id}
                className={`menu-item nav-item ${isActive ? "current-menu-item active" : ""}`}
              >
                <Link
                  href={link.href}
                  className="nav-link"
                  aria-current={isActive ? "page" : undefined}
                  onClick={onClose}
                >
                  <span>{LABELS[locale][link.key]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Language switch (mobile) */}
      <div className="nav-icn-lang d-md-none" id="langSwitchMobile">
        <div id="langSwitch">
          <div className="wpml-ls-statics-shortcode_actions wpml-ls wpml-ls-legacy-dropdown-click js-wpml-ls-legacy-dropdown-click">
            <ul>
              <li className={`wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-${locale} wpml-ls-current-language wpml-ls-first-item wpml-ls-item-legacy-dropdown-click`}>
                <button
                  type="button"
                  className="js-wpml-ls-item-toggle wpml-ls-item-toggle"
                  style={{background: "transparent", border: 0, color: "inherit"}}
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="wpml-ls-native">{locale.toUpperCase()}</span>
                </button>
                <ul className="js-wpml-ls-sub-menu wpml-ls-sub-menu">
                  <li className={`wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-${otherLocale} wpml-ls-last-item`}>
                    <Link
                      href={rest}
                      locale={otherLocale}
                      className="wpml-ls-link"
                      onClick={onClose}
                    >
                      <span className="wpml-ls-native" lang={otherLocale}>
                        {otherLocale.toUpperCase()}
                      </span>
                    </Link>
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
