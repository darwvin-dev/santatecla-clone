'use client';

import { useEffect, useRef, useState } from "react";
import Header from "./layout/Header";
import NavMenu from "./layout/NavMenu";
import "../globals.css"
import Footer from "./layout/Footer";
import BannerBook from "./layout/BannerBook";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      {<NavMenu isMenuOpen={isMenuOpen} menuRef={menuRef} />}
      <div className="wrap container-fluid">
        <div className="content row">
          <main className="main col-12">
            {children}
          <BannerBook />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
